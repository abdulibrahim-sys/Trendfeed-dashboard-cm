'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { mockPerformanceData } from '@/lib/mockData';
import { format } from 'date-fns';

export default function PerformanceChart() {
  const data = mockPerformanceData.map(item => ({
    ...item,
    dateFormatted: format(new Date(item.date), 'MMM dd'),
  }));

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Campaign Performance Over Time</h2>
        <p className="text-sm text-gray-500">Email activity for the last 7 days</p>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="dateFormatted"
            stroke="#6b7280"
            fontSize={12}
            tickLine={false}
          />
          <YAxis
            stroke="#6b7280"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '12px',
            }}
          />
          <Legend
            wrapperStyle={{
              paddingTop: '20px',
            }}
          />
          <Line
            type="monotone"
            dataKey="emailsSent"
            stroke="#3b82f6"
            strokeWidth={2}
            name="Emails Sent"
            dot={{ fill: '#3b82f6', r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="replies"
            stroke="#8b5cf6"
            strokeWidth={2}
            name="Replies"
            dot={{ fill: '#8b5cf6', r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="positiveReplies"
            stroke="#10b981"
            strokeWidth={2}
            name="Positive Replies"
            dot={{ fill: '#10b981', r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="meetingsBooked"
            stroke="#6366f1"
            strokeWidth={2}
            name="Meetings Booked"
            dot={{ fill: '#6366f1', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
