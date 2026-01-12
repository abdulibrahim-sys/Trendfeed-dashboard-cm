import { NextResponse } from 'next/server';
import { getPerformanceData } from '@/lib/instantly-api';
import { mockPerformanceData } from '@/lib/mockData';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('start_date') || undefined;
    const endDate = searchParams.get('end_date') || undefined;

    // Try to fetch from Instantly.ai API first
    try {
      const performanceData = await getPerformanceData(startDate, endDate);
      return NextResponse.json(performanceData);
    } catch (apiError) {
      // Fallback to mock data if API fails
      console.warn('Falling back to mock data:', apiError);
      return NextResponse.json(mockPerformanceData);
    }
  } catch (error) {
    console.error('Error fetching performance data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch performance data' },
      { status: 500 }
    );
  }
}
