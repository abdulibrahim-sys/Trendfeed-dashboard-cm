export type DateRangePreset =
  | 'today'
  | 'last7days'
  | 'last30days'
  | 'monthToDate'
  | 'last3months'
  | 'last6months'
  | 'last12months'
  | 'allTime'
  | 'custom';

export interface DateRange {
  startDate: string;
  endDate: string;
  preset: DateRangePreset;
}

export function getDateRange(preset: DateRangePreset, customStart?: string, customEnd?: string): DateRange {
  const today = new Date();
  const endDate = today.toISOString().split('T')[0];
  let startDate: string;

  switch (preset) {
    case 'today':
      startDate = endDate;
      break;

    case 'last7days':
      const last7Days = new Date(today);
      last7Days.setDate(today.getDate() - 7);
      startDate = last7Days.toISOString().split('T')[0];
      break;

    case 'last30days':
      const last30Days = new Date(today);
      last30Days.setDate(today.getDate() - 30);
      startDate = last30Days.toISOString().split('T')[0];
      break;

    case 'monthToDate':
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
      startDate = monthStart.toISOString().split('T')[0];
      break;

    case 'last3months':
      const last3Months = new Date(today);
      last3Months.setMonth(today.getMonth() - 3);
      startDate = last3Months.toISOString().split('T')[0];
      break;

    case 'last6months':
      const last6Months = new Date(today);
      last6Months.setMonth(today.getMonth() - 6);
      startDate = last6Months.toISOString().split('T')[0];
      break;

    case 'last12months':
      const last12Months = new Date(today);
      last12Months.setFullYear(today.getFullYear() - 1);
      startDate = last12Months.toISOString().split('T')[0];
      break;

    case 'allTime':
      // Set to a very early date (5 years ago)
      const allTimeStart = new Date(today);
      allTimeStart.setFullYear(today.getFullYear() - 5);
      startDate = allTimeStart.toISOString().split('T')[0];
      break;

    case 'custom':
      if (!customStart || !customEnd) {
        throw new Error('Custom date range requires both start and end dates');
      }
      startDate = customStart;
      return {
        startDate,
        endDate: customEnd,
        preset: 'custom',
      };

    default:
      // Default to last 7 days
      const defaultStart = new Date(today);
      defaultStart.setDate(today.getDate() - 7);
      startDate = defaultStart.toISOString().split('T')[0];
  }

  return {
    startDate,
    endDate,
    preset,
  };
}

export const dateRangeLabels: Record<DateRangePreset, string> = {
  today: 'Today',
  last7days: 'Last 7 Days',
  last30days: 'Last 30 Days',
  monthToDate: 'Month to Date',
  last3months: 'Last 3 Months',
  last6months: 'Last 6 Months',
  last12months: 'Last 12 Months',
  allTime: 'All Time',
  custom: 'Custom Range',
};
