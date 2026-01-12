import { Mail, MailOpen, MessageSquare, AlertCircle, MousePointerClick, UserPlus } from 'lucide-react';
import { mockMetrics } from '@/lib/mockData';

interface MetricCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
}

function MetricCard({ title, value, subtitle, icon, trend, trendUp }: MetricCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
          <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
          {trend && (
            <p className={`mt-2 text-sm font-medium ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
              {trend}
            </p>
          )}
        </div>
        <div className="ml-4 p-3 bg-blue-50 rounded-lg">
          {icon}
        </div>
      </div>
    </div>
  );
}

export default function MetricsOverview() {
  const metrics = mockMetrics;

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      <MetricCard
        title="Total Sent"
        value={metrics.totalEmailsSent.toLocaleString()}
        subtitle="Emails delivered"
        icon={<Mail className="h-6 w-6 text-blue-600" />}
      />
      <MetricCard
        title="Open Rate"
        value={`${metrics.avgOpenRate}%`}
        subtitle={`${metrics.totalOpens.toLocaleString()} opens`}
        icon={<MailOpen className="h-6 w-6 text-green-600" />}
        trend="+2.5% vs last week"
        trendUp={true}
      />
      <MetricCard
        title="Reply Rate"
        value={`${metrics.avgReplyRate}%`}
        subtitle={`${metrics.totalReplies.toLocaleString()} replies`}
        icon={<MessageSquare className="h-6 w-6 text-purple-600" />}
        trend="+0.8% vs last week"
        trendUp={true}
      />
      <MetricCard
        title="Click Rate"
        value={`${metrics.avgClickRate}%`}
        subtitle={`${metrics.totalClicks.toLocaleString()} clicks`}
        icon={<MousePointerClick className="h-6 w-6 text-indigo-600" />}
      />
      <MetricCard
        title="Bounce Rate"
        value={`${metrics.avgBounceRate}%`}
        subtitle={`${metrics.totalBounces.toLocaleString()} bounces`}
        icon={<AlertCircle className="h-6 w-6 text-red-600" />}
        trend="-0.3% vs last week"
        trendUp={true}
      />
      <MetricCard
        title="Total Leads"
        value={metrics.totalLeads.toLocaleString()}
        subtitle="Qualified leads"
        icon={<UserPlus className="h-6 w-6 text-yellow-600" />}
        trend="+12 this week"
        trendUp={true}
      />
    </div>
  );
}
