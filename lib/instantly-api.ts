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
 * Fetch all emails from Unibox with pagination
 * Uses: GET /emails?email_type=received
 */
async function fetchAllEmails(campaignId?: string, startDate?: string, endDate?: string): Promise<any[]> {
  const allEmails: any[] = [];
  let hasMore = true;
  let startingAfter: string | undefined = undefined;
  const limit = 100; // Max per request

  while (hasMore) {
    const params: Record<string, string | number | undefined> = {
      email_type: 'received',
      limit,
      starting_after: startingAfter,
    };

    if (campaignId) {
      params.campaign_id = campaignId;
    }

    try {
      const response = await instantlyApiCall({
        endpoint: '/emails',
        params,
      });

      const emails = response.data || response || [];

      // Filter by date if provided
      const filteredEmails = emails.filter((email: any) => {
        if (!startDate && !endDate) return true;
        const emailDate = email.timestamp_email || email.timestamp_created;
        if (!emailDate) return true;

        const date = new Date(emailDate);
        if (startDate && date < new Date(startDate)) return false;
        if (endDate && date > new Date(endDate + 'T23:59:59')) return false;
        return true;
      });

      allEmails.push(...filteredEmails);

      // Check if there are more results
      if (emails.length < limit) {
        hasMore = false;
      } else {
        // Get the last item's ID for pagination
        startingAfter = emails[emails.length - 1]?.id;
        if (!startingAfter) hasMore = false;
      }
    } catch (error) {
      console.error('Error fetching emails:', error);
      hasMore = false;
    }
  }

  return allEmails;
}

/**
 * Fetch leads by status using POST /leads/list
 */
async function fetchLeadsByStatus(status: string, campaignId?: string): Promise<any[]> {
  try {
    const body: Record<string, any> = {
      filters: {
        interest_status: status,
      },
    };

    if (campaignId) {
      body.filters.campaign_id = campaignId;
    }

    const response = await instantlyApiCall({
      endpoint: '/leads/list',
      method: 'POST',
      body,
    });

    return response.data || response || [];
  } catch (error) {
    console.error(`Error fetching leads with status ${status}:`, error);
    return [];
  }
}

/**
 * Fetch campaign list
 * Uses: GET /campaigns
 */
async function fetchCampaignsList(): Promise<any[]> {
  try {
    const response = await instantlyApiCall({
      endpoint: '/campaigns',
      params: { limit: 100 },
    });

    return response.data || response || [];
  } catch (error) {
    console.error('Error fetching campaigns list:', error);
    throw error;
  }
}

/**
 * Get all campaigns with ACCURATE analytics calculated from raw data
 */
export async function getCampaigns(startDate?: string, endDate?: string): Promise<Campaign[]> {
  try {
    // Fetch all campaigns
    const campaignsList = await fetchCampaignsList();

    // For each campaign, fetch accurate data
    const campaignsWithMetrics = await Promise.all(
      campaignsList.map(async (campaign: any) => {
        const campaignId = campaign.id;

        // Fetch actual replies from Unibox
        const replies = await fetchAllEmails(campaignId, startDate, endDate);

        // Fetch positive replies (interested leads)
        const interestedLeads = await fetchLeadsByStatus('interested', campaignId);

        // Fetch meetings booked
        const meetingBookedLeads = await fetchLeadsByStatus('meeting_booked', campaignId);

        // Calculate metrics from raw data
        const emailsSent = campaign.sent_count || campaign.contacted_count || 0;
        const totalReplies = replies.length;
        const positiveReplies = interestedLeads.length;
        const meetingsBooked = meetingBookedLeads.length;

        return {
          id: campaignId,
          name: campaign.name,
          status: mapCampaignStatus(campaign.status),
          emailsSent,
          replies: totalReplies,
          replyRate: emailsSent > 0 ? parseFloat(((totalReplies / emailsSent) * 100).toFixed(2)) : 0,
          positiveReplies,
          positiveReplyRate: totalReplies > 0 ? parseFloat(((positiveReplies / totalReplies) * 100).toFixed(2)) : 0,
          meetingsBooked,
          meetingsBookedRate: emailsSent > 0 ? parseFloat(((meetingsBooked / emailsSent) * 100).toFixed(2)) : 0,
          startDate: campaign.timestamp_created || new Date().toISOString(),
          lastActivity: campaign.timestamp_updated || new Date().toISOString(),
        };
      })
    );

    return campaignsWithMetrics;
  } catch (error) {
    console.error('Failed to fetch campaigns:', error);
    throw error;
  }
}

/**
 * Get dashboard overview metrics calculated from ACCURATE raw data
 */
export async function getMetrics(startDate?: string, endDate?: string): Promise<DashboardMetrics> {
  try {
    // Fetch all campaigns to get accurate aggregate metrics
    const campaigns = await getCampaigns(startDate, endDate);

    // Aggregate metrics from all campaigns
    const totalEmailsSent = campaigns.reduce((sum, c) => sum + c.emailsSent, 0);
    const totalReplies = campaigns.reduce((sum, c) => sum + c.replies, 0);
    const totalPositiveReplies = campaigns.reduce((sum, c) => sum + c.positiveReplies, 0);
    const totalMeetingsBooked = campaigns.reduce((sum, c) => sum + c.meetingsBooked, 0);

    return {
      totalEmailsSent,
      totalReplies,
      avgReplyRate: totalEmailsSent > 0 ? parseFloat(((totalReplies / totalEmailsSent) * 100).toFixed(2)) : 0,
      totalPositiveReplies,
      avgPositiveReplyRate: totalReplies > 0 ? parseFloat(((totalPositiveReplies / totalReplies) * 100).toFixed(2)) : 0,
      totalMeetingsBooked,
      avgMeetingsBookedRate: totalEmailsSent > 0 ? parseFloat(((totalMeetingsBooked / totalEmailsSent) * 100).toFixed(2)) : 0,
    };
  } catch (error) {
    console.error('Failed to fetch metrics:', error);
    throw error;
  }
}

/**
 * Get daily performance data calculated from raw email data
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

    // Fetch all emails for the date range
    const allEmails = await fetchAllEmails(undefined, start, end);

    // Fetch campaigns to get sent count per day (we'll need to use analytics for this)
    const analyticsData = await instantlyApiCall({
      endpoint: '/campaigns/analytics/daily',
      params: {
        start_date: start,
        end_date: end,
      },
    });

    // Group emails by date
    const emailsByDate: Record<string, any[]> = {};
    allEmails.forEach(email => {
      const date = (email.timestamp_email || email.timestamp_created || '').split('T')[0];
      if (date) {
        if (!emailsByDate[date]) emailsByDate[date] = [];
        emailsByDate[date].push(email);
      }
    });

    // Create performance data array
    const performanceMap: Record<string, PerformanceData> = {};

    // Add sent data from analytics (this is accurate)
    const analyticsArray = analyticsData.data || analyticsData || [];
    analyticsArray.forEach((day: any) => {
      const date = day.date;
      performanceMap[date] = {
        date,
        emailsSent: day.sent || 0,
        replies: 0,
        positiveReplies: 0,
        meetingsBooked: 0,
      };
    });

    // Add reply counts from actual emails
    Object.entries(emailsByDate).forEach(([date, emails]) => {
      if (!performanceMap[date]) {
        performanceMap[date] = {
          date,
          emailsSent: 0,
          replies: 0,
          positiveReplies: 0,
          meetingsBooked: 0,
        };
      }
      performanceMap[date].replies = emails.length;
    });

    // Convert to array and sort by date
    return Object.values(performanceMap).sort((a, b) => a.date.localeCompare(b.date));
  } catch (error) {
    console.error('Failed to fetch performance data:', error);
    throw error;
  }
}

function mapCampaignStatus(status: string | number): 'active' | 'paused' | 'completed' {
  const statusLower = String(status).toLowerCase();
  if (statusLower.includes('active') || statusLower === '1') return 'active';
  if (statusLower.includes('pause') || statusLower === '2') return 'paused';
  if (statusLower.includes('complete') || statusLower.includes('stop') || statusLower === '3') return 'completed';
  return 'paused';
}
