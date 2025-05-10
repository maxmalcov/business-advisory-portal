// Chart color constants
export const CHART_COLORS = {
  primary: '#9b87f5',
  muted: '#8E9196',
  background: '#fff',
  text: 'rgba(255,255,255,0.76)',
};

// Time range options
export const TIME_RANGES = [
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '90d', label: 'Last 90 days' },
  { value: 'custom', label: 'Custom range' },
];

// Format date for display in tooltip
export const formatTooltipDate = (date: string): string => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

// Format date for axis display
export const formatAxisDate = (date: string): string => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
};

// Filter data based on selected time range or custom date range
export const filterChartData = (
  data: Array<{ date: string; count: number }>,
  timeRange: string,
  dateRange: { from: Date | undefined; to: Date | undefined },
): Array<{ date: string; count: number }> => {
  if (timeRange === 'custom' && dateRange.from && dateRange.to) {
    return data.filter((item) => {
      const itemDate = new Date(item.date);
      return itemDate >= dateRange.from! && itemDate <= dateRange.to!;
    });
  } else {
    const days = parseInt(timeRange.replace('d', ''));
    return data.slice(-days);
  }
};
