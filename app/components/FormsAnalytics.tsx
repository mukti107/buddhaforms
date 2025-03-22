'use client';

import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

// Simple mock data for the chart
const mockChartData = [
  { date: 'Jan', forms: 5, submissions: 45 },
  { date: 'Feb', forms: 8, submissions: 67 },
  { date: 'Mar', forms: 10, submissions: 98 },
  { date: 'Apr', forms: 12, submissions: 120 },
  { date: 'May', forms: 15, submissions: 162 },
  { date: 'Jun', forms: 18, submissions: 214 },
];

const FormsAnalytics: React.FC = () => {
  return (
    <Card className="card-hubspot h-full">
      <div className="flex items-start justify-between px-6 pt-6">
        <CardHeader className="p-0">
          <CardTitle>Form Analytics</CardTitle>
          <CardDescription>Overview of form performance over time</CardDescription>
        </CardHeader>
        <div className="flex items-center space-x-2 pt-1">
          <div className="flex items-center mr-1">
            <span className="w-3 h-3 bg-hubspot-orange rounded-full inline-block mr-1"></span>
            <span className="text-hubspot-gray-600 text-sm">Submissions</span>
          </div>
          <select className="text-hubspot-gray-600 bg-hubspot-gray-50 border border-hubspot-gray-200 rounded-hubspot px-2 py-1 text-sm">
            <option>This month</option>
            <option>Last 30 days</option>
            <option>Last month</option>
            <option>Last 3 months</option>
            <option>Last 6 months</option>
            <option>Last 12 months</option>
            <option>This year</option>
            <option>Last year</option>
          </select>
        </div>
      </div>
      <CardContent className="pt-4 pb-0">
        {/* Stats above the chart in a horizontal layout */}
        <div className="flex justify-between mb-4 px-1">
          <div className="bg-hubspot-gray-50 rounded-hubspot p-3 flex-1 mr-3">
            <div className="text-sm text-hubspot-gray-600">Total Forms</div>
            <div className="text-2xl font-semibold text-hubspot-blue-dark">{mockChartData[mockChartData.length - 1].forms}</div>
          </div>
          <div className="bg-hubspot-gray-50 rounded-hubspot p-3 flex-1">
            <div className="text-sm text-hubspot-gray-600">Total Submissions</div>
            <div className="text-2xl font-semibold text-hubspot-blue-dark">{mockChartData[mockChartData.length - 1].submissions}</div>
          </div>
        </div>
        
        {/* Chart taking full width */}
        <div className="w-full h-[175px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={mockChartData}
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