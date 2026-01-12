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

  const handleRangeChange = (preset: DateRangePreset, customStart?: string, customEnd?: string) => {
    setSelectedPreset(preset);
    const newRange = getDateRange(preset, customStart, customEnd);
    setDateRange(newRange);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
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
            <div className="text-gray-500">Loading data...</div>
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
