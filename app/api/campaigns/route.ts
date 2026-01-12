import { NextResponse } from 'next/server';
import { getCampaigns } from '@/lib/instantly-api';
import { mockCampaigns } from '@/lib/mockData';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('start_date') || undefined;
    const endDate = searchParams.get('end_date') || undefined;

    // Try to fetch from Instantly.ai API first
    try {
      const campaigns = await getCampaigns(startDate, endDate);
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
