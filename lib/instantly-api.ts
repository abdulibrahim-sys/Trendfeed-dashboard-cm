import { Campaign, DashboardMetrics, PerformanceData } from '@/types/campaign';

const INSTANTLY_API_KEY = process.env.INSTANTLY_API_KEY;
const INSTANTLY_API_URL = process.env.INSTANTLY_API_URL || 'https://api.instantly.ai/api/v2';

interface InstantlyApiOptions {
  endpoint: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  params?: Record<string, string | number | undefined>;
  body?: Record<string, unknown>;
}

async function instantlyApiCall({ endpoint, method = 'GET', params, body }: InstantlyApiOptions) {
  // Build URL with query parameters
  const url = new URL(`${INSTANTLY_API_URL}${endpoint}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.append(key, String(value));
      }
    });
  }

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  // API V2 uses Bearer token authentication
  if (INSTANTLY_API_KEY) {
    headers['Authorization'] = `Bearer ${INSTANTLY_API_KEY}`;
  } else {
    throw new Error('INSTANTLY_API_KEY is not configured');
  }

  const options: RequestInit = {
    method,
    headers,
    ...(body && { body: JSON.stringify(body) }),
  };

  try {
    const response = await fetch(url.toString(), options);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Instantly.ai API error (${response.status}): ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error calling Instantly.ai API:', error);
    throw error;
  }
}

/**
 * Get all campaigns with their analytics
 * Uses: GET /campaigns/analytics
 */
export async function getCampaigns(startDate?: string, endDate?: string): Promise<Campaign[]> {
  try {
    const params: Record<string, string | undefined> = {};
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;

    const data = await instantlyApiCall({
      endpoint: '/campaigns/analytics',
      params,
    });

    return transformCampaignData(data);
  } catch (error) {
    console.error('Failed to fetch campaigns:', error);
    throw error;
  }
}

/**
 * Get dashboard overview metrics
 * Uses: GET /campaigns/analytics/overview
 */
export async function getMetrics(startDate?: string, endDate?: string): Promise<DashboardMetrics> {
  try {
    const params: Record<string, string | undefined> = {};
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;

    const data = await instantlyApiCall({
      endpoint: '/campaigns/analytics/overview',
      params,
    });

    return transformMetricsData(data);
  } catch (error) {
    console.error('Failed to fetch metrics:', error);
    throw error;
  }
}

/**
 * Get daily performance data for charts
 * Uses: GET /campaigns/analytics/daily
 */
export async function getPerformanceData(startDate?: string, endDate?: string): Promise<PerformanceData[]> {
  try {
    // Use provided dates or default to last 7 days
    let start = startDate;
    let end = endDate;

    if (!start || !end) {
      const today = new Date();
      const defaultStart = new Date();
      defaultStart.setDate(today.getDate() - 7);
      start = defaultStart.toISOString().split('T')[0];
      end = today.toISOString().split('T')[0];
    }

    const data = await instantlyApiCall({
      endpoint: '/campaigns/analytics/daily',
      params: {
        start_date: start,
        end_date: end,
      },
    });

    return transformPerformanceData(data);
  } catch (error) {
    console.error('Failed to fetch performance data:', error);
    throw error;
  }
}

// Helper functions to transform Instantly.ai API responses to our dashboard types

interface InstantlyCampaignAnalytics {
  campaign_id: string;
  campaign_name: string;
  campaign_status: string | number;
  emails_sent_count: number;
  reply_count: number;
  reply_count_unique: number;
  total_opportunities: number;
  leads_count: number;
  contacted_count: number;
  timestamp_created?: string;
  timestamp_updated?: string;
}

function transformCampaignData(apiData: any): Campaign[] {
  if (!apiData || !Array.isArray(apiData)) {
    console.warn('Invalid campaign data received:', apiData);
    return [];
  }

  return apiData.map((campaign: InstantlyCampaignAnalytics) => {
    const emailsSent = campaign.emails_sent_count || 0;
    const replies = campaign.reply_count_unique || 0;
    const positiveReplies = campaign.total_opportunities || 0;
    // Note: Meetings booked is included in opportunities count
    // For more precise tracking, we'd need additional API calls to filter by status
    const meetingsBooked = Math.floor(positiveReplies * 0.3); // Estimate ~30% of opportunities convert to meetings

    return {
      id: campaign.campaign_id,
      name: campaign.campaign_name,
      status: mapCampaignStatus(campaign.campaign_status),
      emailsSent,
      replies,
      replyRate: emailsSent > 0 ? parseFloat(((replies / emailsSent) * 100).toFixed(2)) : 0,
      positiveReplies,
      positiveReplyRate: replies > 0 ? parseFloat(((positiveReplies / replies) * 100).toFixed(2)) : 0,
      meetingsBooked,
      meetingsBookedRate: emailsSent > 0 ? parseFloat(((meetingsBooked / emailsSent) * 100).toFixed(2)) : 0,
      startDate: campaign.timestamp_created || new Date().toISOString(),
      lastActivity: campaign.timestamp_updated || new Date().toISOString(),
    };
  });
}

function transformMetricsData(apiData: any): DashboardMetrics {
  if (!apiData) {
    console.warn('Invalid metrics data received:', apiData);
    throw new Error('Invalid metrics data');
  }

  // API v2 returns aggregated data across all campaigns
  const totalEmailsSent = apiData.emails_sent_count || 0;
  const totalReplies = apiData.reply_count_unique || apiData.reply_count || 0;
  const totalPositiveReplies = apiData.total_opportunities || 0;
  const totalMeetingsBooked = Math.floor(totalPositiveReplies * 0.3); // Estimate ~30% of opportunities convert to meetings

  return {
    totalEmailsSent,
    totalReplies,
    avgReplyRate: totalEmailsSent > 0 ? parseFloat(((totalReplies / totalEmailsSent) * 100).toFixed(2)) : 0,
    totalPositiveReplies,
    avgPositiveReplyRate: totalReplies > 0 ? parseFloat(((totalPositiveReplies / totalReplies) * 100).toFixed(2)) : 0,
    totalMeetingsBooked,
    avgMeetingsBookedRate: totalEmailsSent > 0 ? parseFloat(((totalMeetingsBooked / totalEmailsSent) * 100).toFixed(2)) : 0,
  };
}

function transformPerformanceData(apiData: any): PerformanceData[] {
  if (!apiData || !Array.isArray(apiData)) {
    console.warn('Invalid performance data received:', apiData);
    return [];
  }

  return apiData.map((day: any) => {
    const emailsSent = day.sent || day.emails_sent_count || 0;
    const replies = day.unique_replies || day.replies || 0;
    const positiveReplies = day.opportunities || day.unique_opportunities || 0;
    const meetingsBooked = Math.floor(positiveReplies * 0.3); // Estimate ~30% of opportunities convert to meetings

    return {
      date: day.date,
      emailsSent,
      replies,
      positiveReplies,
      meetingsBooked,
    };
  });
}

function mapCampaignStatus(status: string): 'active' | 'paused' | 'completed' {
  const statusLower = String(status).toLowerCase();
  if (statusLower.includes('active') || statusLower === '1') return 'active';
  if (statusLower.includes('pause') || statusLower === '2') return 'paused';
  if (statusLower.includes('complete') || statusLower.includes('stop') || statusLower === '3') return 'completed';
  return 'paused';
}
