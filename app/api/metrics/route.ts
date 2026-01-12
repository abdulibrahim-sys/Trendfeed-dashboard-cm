import { NextResponse } from 'next/server';
import { mockMetrics } from '@/lib/mockData';
// import { getMetrics } from '@/lib/instantly-api';

export async function GET() {
  try {
    // TODO: Replace mock data with actual API call when Instantly.ai credentials are configured
    // const metrics = await getMetrics();
    const metrics = mockMetrics;

    return NextResponse.json(metrics);
  } catch (error) {
    console.error('Error fetching metrics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch metrics' },
      { status: 500 }
    );
  }
}
