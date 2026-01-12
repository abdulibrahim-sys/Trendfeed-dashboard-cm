import { NextResponse } from 'next/server';
import { mockPerformanceData } from '@/lib/mockData';
// import { getPerformanceData } from '@/lib/instantly-api';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '7', 10);

    // TODO: Replace mock data with actual API call when Instantly.ai credentials are configured
    // const performanceData = await getPerformanceData(days);
    const performanceData = mockPerformanceData;

    return NextResponse.json(performanceData);
  } catch (error) {
    console.error('Error fetching performance data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch performance data' },
      { status: 500 }
    );
  }
}
