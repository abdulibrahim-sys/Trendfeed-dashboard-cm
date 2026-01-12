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
export async function getCampaigns(): Promise<Campaign[]> {
  try {
    const data = await instantlyApiCall({
      endpoint: '/campaigns/analytics',
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
export async function getMetrics(): Promise<DashboardMetrics> {
  try {
    const data = await instantlyApiCall({
      endpoint: '/campaigns/analytics/overview',
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
export async function getPerformanceData(days = 7): Promise<PerformanceData[]> {
  try {
    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const data = await instantlyApiCall({
      endpoint: '/campaigns/analytics/daily',
      params: {
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
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
  campaign_status: string;
  emails_sent: number;
  total_replies: number;
  positive_replies?: number;
  meeting_booked?: number;
  created_at: string;
  updated_at: string;
}

function transformCampaignData(apiData: any): Campaign[] {
  if (!apiData || !Array.isArray(apiData)) {
    console.warn('Invalid campaign data received:', apiData);
    return [];
  }

  return apiData.map((campaign: InstantlyCampaignAnalytics) => {
    const emailsSent = campaign.emails_sent || 0;
    const replies = campaign.total_replies || 0;
    const positiveReplies = campaign.positive_replies || Math.floor(replies * 0.6); // Estimate if not available
    const meetingsBooked = campaign.meeting_booked || 0;

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
      startDate: campaign.created_at,
      lastActivity: campaign.updated_at,
    };
  });
}

function transformMetricsData(apiData: any): DashboardMetrics {
  if (!apiData) {
    console.warn('Invalid metrics data received:', apiData);
    throw new Error('Invalid metrics data');
  }

  const totalEmailsSent = apiData.total_emails_sent || apiData.emails_sent || 0;
  const totalReplies = apiData.total_replies || 0;
  const totalPositiveReplies = apiData.positive_replies || Math.floor(totalReplies * 0.6);
  const totalMeetingsBooked = apiData.meeting_booked || apiData.meetings_booked || 0;

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
    const emailsSent = day.emails_sent || 0;
    const replies = day.total_replies || day.replies || 0;
    const positiveReplies = day.positive_replies || Math.floor(replies * 0.6);
    const meetingsBooked = day.meeting_booked || day.meetings_booked || 0;

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
