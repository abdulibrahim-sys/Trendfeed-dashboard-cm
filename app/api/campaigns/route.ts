import { NextResponse } from 'next/server';
import { mockCampaigns } from '@/lib/mockData';
// import { getCampaigns } from '@/lib/instantly-api';

export async function GET() {
  try {
    // TODO: Replace mock data with actual API call when Instantly.ai credentials are configured
    // const campaigns = await getCampaigns();
    const campaigns = mockCampaigns;

    return NextResponse.json(campaigns);
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    return NextResponse.json(
      { error: 'Failed to fetch campaigns' },
      { status: 500 }
    );
  }
}
