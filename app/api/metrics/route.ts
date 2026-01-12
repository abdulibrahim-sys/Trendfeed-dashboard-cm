import { NextResponse } from 'next/server';
import { getMetrics } from '@/lib/instantly-api';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('start_date') || undefined;
    const endDate = searchParams.get('end_date') || undefined;

    const metrics = await getMetrics(startDate, endDate);
    return NextResponse.json(metrics);
  } catch (error) {
    console.error('Error fetching metrics from Instantly.ai API:', error);
    return NextResponse.json(
      { error: 'Failed to connect to Instantly.ai API. Please check your API key and network connection.' },
      { status: 500 }
    );
  }
}
