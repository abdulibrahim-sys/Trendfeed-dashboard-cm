export interface Campaign {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'completed';
  emailsSent: number;
  replies: number;
  replyRate: number;
  positiveReplies: number;
  positiveReplyRate: number;
  meetingsBooked: number;
  meetingsBookedRate: number;
  startDate: string;
  lastActivity: string;
}

export interface DashboardMetrics {
  totalEmailsSent: number;
  totalReplies: number;
  avgReplyRate: number;
  totalPositiveReplies: number;
  avgPositiveReplyRate: number;
  totalMeetingsBooked: number;
  avgMeetingsBookedRate: number;
}

export interface PerformanceData {
  date: string;
  emailsSent: number;
  replies: number;
  positiveReplies: number;
  meetingsBooked: number;
}
