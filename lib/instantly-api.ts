import { Campaign, DashboardMetrics, PerformanceData } from '@/types/campaign';

const INSTANTLY_API_KEY = process.env.INSTANTLY_API_KEY;
const INSTANTLY_API_URL = process.env.INSTANTLY_API_URL || 'https://api.instantly.ai/api/v1';

interface InstantlyApiOptions {
  endpoint: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: Record<string, unknown>;
}

async function instantlyApiCall({ endpoint, method = 'GET', body }: InstantlyApiOptions) {
  const url = `${INSTANTLY_API_URL}${endpoint}`;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (INSTANTLY_API_KEY) {
    headers['Authorization'] = `Bearer ${INSTANTLY_API_KEY}`;
  }

  const options: RequestInit = {
    method,
    headers,
    ...(body && { body: JSON.stringify(body) }),
  };

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`Instantly.ai API error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error calling Instantly.ai API:', error);
    throw error;
  }
}

export async function getCampaigns(): Promise<Campaign[]> {
  // TODO: Replace with actual API call when credentials are available
  // const data = await instantlyApiCall({ endpoint: '/campaigns' });
  // return transformCampaignData(data);

  throw new Error('Instantly.ai API integration pending - please configure API key');
}

export async function getMetrics(): Promise<DashboardMetrics> {
  // TODO: Replace with actual API call when credentials are available
  // const data = await instantlyApiCall({ endpoint: '/analytics/metrics' });
  // return transformMetricsData(data);

  throw new Error('Instantly.ai API integration pending - please configure API key');
}

export async function getPerformanceData(days = 7): Promise<PerformanceData[]> {
  // TODO: Replace with actual API call when credentials are available
  // const data = await instantlyApiCall({
  //   endpoint: `/analytics/performance?days=${days}`
  // });
  // return transformPerformanceData(data);

  throw new Error('Instantly.ai API integration pending - please configure API key');
}

// Helper functions to transform API responses to our types
// These will need to be implemented based on actual Instantly.ai API response format

function transformCampaignData(apiData: unknown): Campaign[] {
  // TODO: Implement transformation logic
  return [];
}

function transformMetricsData(apiData: unknown): DashboardMetrics {
  // TODO: Implement transformation logic
  return {} as DashboardMetrics;
}

function transformPerformanceData(apiData: unknown): PerformanceData[] {
  // TODO: Implement transformation logic
  return [];
}
