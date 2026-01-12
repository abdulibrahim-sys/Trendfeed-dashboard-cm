import { NextResponse } from 'next/server';
import { getCampaigns } from '@/lib/instantly-api';
import { mockCampaigns } from '@/lib/mockData';

export async function GET() {
  try {
    // Try to fetch from Instantly.ai API first
    try {
      const campaigns = await getCampaigns();
      return NextResponse.json(campaigns);
    } catch (apiError) {
      // Fallback to mock data if API fails
      console.warn('Falling back to mock data:', apiError);
      return NextResponse.json(mockCampaigns);
    }
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    return NextResponse.json(
      { error: 'Failed to fetch campaigns' },
      { status: 500 }
    );
  }
}
