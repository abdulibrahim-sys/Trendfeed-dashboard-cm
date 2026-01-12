import { NextResponse } from 'next/server';
import { getMetrics } from '@/lib/instantly-api';
import { mockMetrics } from '@/lib/mockData';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('start_date') || undefined;
    const endDate = searchParams.get('end_date') || undefined;

    // Try to fetch from Instantly.ai API first
    try {
      const metrics = await getMetrics(startDate, endDate);
      return NextResponse.json(metrics);
    } catch (apiError) {
      // Fallback to mock data if API fails
      console.warn('Falling back to mock data:', apiError);
      return NextResponse.json(mockMetrics);
    }
  } catch (error) {
    console.error('Error fetching metrics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch metrics' },
      { status: 500 }
    );
  }
}
