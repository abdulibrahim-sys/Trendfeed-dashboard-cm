export interface Campaign {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'completed';
  emailsSent: number;
  opens: number;
  openRate: number;
  replies: number;
  replyRate: number;
  clicks: number;
  clickRate: number;
  bounces: number;
  bounceRate: number;
  leads: number;
  startDate: string;
  lastActivity: string;
}

export interface DashboardMetrics {
  totalEmailsSent: number;
  totalOpens: number;
  totalReplies: number;
  totalBounces: number;
  totalClicks: number;
  totalLeads: number;
  avgOpenRate: number;
  avgReplyRate: number;
  avgClickRate: number;
  avgBounceRate: number;
}

export interface PerformanceData {
  date: string;
  emailsSent: number;
  opens: number;
  replies: number;
  clicks: number;
}
