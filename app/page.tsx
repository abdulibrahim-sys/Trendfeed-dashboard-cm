import { Suspense } from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import MetricsOverview from '@/components/MetricsOverview';
import PerformanceChart from '@/components/PerformanceChart';
import CampaignList from '@/components/CampaignList';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Cold Email Campaign Analytics</h1>
          <p className="mt-2 text-gray-600">Monitor your Instantly.ai campaign performance in real-time</p>
        </div>

        <Suspense fallback={<div>Loading metrics...</div>}>
          <MetricsOverview />
        </Suspense>

        <div className="mt-8">
          <Suspense fallback={<div>Loading chart...</div>}>
            <PerformanceChart />
          </Suspense>
        </div>

        <div className="mt-8">
          <Suspense fallback={<div>Loading campaigns...</div>}>
            <CampaignList />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
