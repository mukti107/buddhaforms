'use client';

import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

interface AnalyticsData {
  chartData: {
    date: string;
    submissions: number;
    forms: number;
  }[];
  totals: {
    forms: number;
    submissions: number;
  };
}

const FormsAnalytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState('last_6_months');
  
  const { data, error, isLoading } = useSWR<AnalyticsData>(
    `/api/analytics?range=${timeRange}`,
    fetcher
  );

  const handleRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTimeRange(e.target.value);
  };

  if (isLoading) {
    return (
      <Card className="card-buddha h-full">
        <div className="flex items-center justify-center h-[300px]">
          <div className="animate-pulse text-buddha-gray-600">Loading analytics...</div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="card-buddha h-full">
        <div className="flex items-center justify-center h-[300px]">
          <div className="text-red-600">Failed to load analytics</div>
        </div>
      </Card>
    );
  }

  const chartData = data?.chartData || [];
  const totals = data?.totals || { forms: 0, submissions: 0 };

  return (
    <Card className="card-buddha h-full">
      <div className="flex items-start justify-between px-6 pt-6">
        <CardHeader className="p-0">
          <CardTitle>Form Analytics</CardTitle>
          <CardDescription>Overview of form performance over time</CardDescription>
        </CardHeader>
        <div className="flex items-center space-x-2 pt-1">
          <div className="flex items-center mr-1">
            <span className="w-3 h-3 bg-buddha-orange rounded-full inline-block mr-1"></span>
            <span className="text-buddha-gray-600 text-sm">Submissions</span>
          </div>
          <select 
            className="text-buddha-gray-600 bg-buddha-gray-50 border border-buddha-gray-200 rounded-buddha px-2 py-1 text-sm"
            value={timeRange}
            onChange={handleRangeChange}
          >
            <option value="this_month">This month</option>
            <option value="last_30_days">Last 30 days</option>
            <option value="last_3_months">Last 3 months</option>
            <option value="last_6_months">Last 6 months</option>
            <option value="last_12_months">Last 12 months</option>
          </select>
        </div>
      </div>
      <CardContent className="pt-4 pb-0">
        {/* Stats above the chart */}
        <div className="flex justify-between mb-4 px-1">
          <div className="bg-buddha-gray-50 rounded-buddha p-3 flex-1 mr-3">
            <div className="text-sm text-buddha-gray-600">Total Forms</div>
            <div className="text-2xl font-semibold text-buddha-blue-dark">{totals.forms}</div>
          </div>
          <div className="bg-buddha-gray-50 rounded-buddha p-3 flex-1">
            <div className="text-sm text-buddha-gray-600">Total Submissions</div>
            <div className="text-2xl font-semibold text-buddha-blue-dark">{totals.submissions}</div>
          </div>
        </div>
        
        {/* Chart */}
        <div className="w-full h-[175px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
            >
              <defs>
                <linearGradient id="submissionGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ff7a59" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#ff7a59" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eaeaea" />
              <XAxis 
                dataKey="date" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#718096', fontSize: 12 }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#718096', fontSize: 12 }}
                width={30}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #eaeaea', 
                  borderRadius: '6px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
                }} 
                labelStyle={{ fontWeight: 'bold', color: '#2D3748' }}
              />
              <Area 
                type="monotone" 
                dataKey="submissions" 
                stroke="#ff7a59" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#submissionGradient)" 
                activeDot={{ r: 6, stroke: '#ff7a59', strokeWidth: 2, fill: '#fff' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default FormsAnalytics; 