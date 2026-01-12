'use client';

import { useState, useEffect } from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import DateRangeSelector from '@/components/DateRangeSelector';
import MetricsOverview from '@/components/MetricsOverview';
import PerformanceChart from '@/components/PerformanceChart';
import CampaignList from '@/components/CampaignList';
import { DateRangePreset, getDateRange } from '@/lib/dateUtils';
import { Campaign, DashboardMetrics, PerformanceData } from '@/types/campaign';

export default function Home() {
  const [selectedPreset, setSelectedPreset] = useState<DateRangePreset>('last7days');
  const [dateRange, setDateRange] = useState(getDateRange('last7days'));
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleRangeChange = (preset: DateRangePreset, customStart?: string, customEnd?: string) => {
    setSelectedPreset(preset);
    const newRange = getDateRange(preset, customStart, customEnd);
    setDateRange(newRange);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({
          start_date: dateRange.startDate,
          end_date: dateRange.endDate,
        });

        // Fetch all data in parallel
        const [metricsRes, campaignsRes, performanceRes] = await Promise.all([
          fetch(`/api/metrics?${params}`),
          fetch(`/api/campaigns?${params}`),
          fetch(`/api/performance?${params}`),
        ]);

        // Check if any response failed
        if (!metricsRes.ok || !campaignsRes.ok || !performanceRes.ok) {
          const errorData = !metricsRes.ok ? await metricsRes.json() :
                            !campaignsRes.ok ? await campaignsRes.json() :
                            await performanceRes.json();
          throw new Error(errorData.error || 'Failed to fetch data from Instantly.ai API');
        }

        const [metricsData, campaignsData, performanceDataRes] = await Promise.all([
          metricsRes.json(),
          campaignsRes.json(),
          performanceRes.json(),
        ]);

        setMetrics(metricsData);
        setCampaigns(campaignsData);
        setPerformanceData(performanceDataRes);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error instanceof Error ? error.message : 'Failed to connect to Instantly.ai API');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dateRange]);

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-3xl font-bold text-gray-900">Cold Email Campaign Analytics</h1>
            <p className="mt-2 text-gray-600">Monitor your Instantly.ai campaign performance in real-time</p>
          </div>
          <DateRangeSelector selectedPreset={selectedPreset} onRangeChange={handleRangeChange} />
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">Loading data from Instantly.ai...</div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-64">
            <div className="max-w-md p-6 bg-red-50 border-2 border-red-200 rounded-lg">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-semibold text-red-800">API Connection Failed</h3>
                  <p className="mt-2 text-sm text-red-700">{error}</p>
                  <p className="mt-3 text-sm text-red-600">
                    Please verify:
                  </p>
                  <ul className="mt-1 text-sm text-red-600 list-disc list-inside">
                    <li>Your Instantly.ai API key is correct</li>
                    <li>The API key has proper permissions</li>
                    <li>Your network connection is working</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {metrics && <MetricsOverview metrics={metrics} />}

            <div className="mt-8">
              {performanceData && <PerformanceChart data={performanceData} />}
            </div>

            <div className="mt-8">
              {campaigns && <CampaignList campaigns={campaigns} />}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
