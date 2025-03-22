'use client';

import React from 'react';
import { RadialBarChart, RadialBar, PolarAngleAxis, Label } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

interface SubmissionLimitInfoProps {
  used: number;
  total: number;
  planName: string;
}

const SubmissionLimitInfo: React.FC<SubmissionLimitInfoProps> = ({
  used = 450,
  total = 1000,
  planName = 'Pro Plan'
}) => {
  // Calculate percentage
  const percentage = Math.min(Math.round((used / total) * 100), 100);
  
  // Format chart data for RadialBarChart - only one bar with buddha orange color
  const chartData = [
    {
      name: 'Submissions',
      value: percentage,
      fill: '#ff7a59' // buddha orange
    }
  ];
  
  return (
    <Card className="card-buddha h-full flex flex-col">
      <CardHeader className="items-center text-center p-6 pb-0">
        <CardTitle>Submission Limits</CardTitle>
        <CardDescription>Plan usage this month</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex items-center justify-center pt-4 pb-0">
        <div className="mx-auto w-full max-w-[250px] relative">
          <RadialBarChart 
            width={250} 
            height={175} 
            data={chartData}
            innerRadius={80}
            outerRadius={130}
            barSize={20}
            startAngle={180}
            endAngle={0}
            cx={125}
            cy={125}
          >
            <PolarAngleAxis
              type="number"
              domain={[0, 100]}
              tick={false}
              axisLine={false}
            />
            <RadialBar
              dataKey="value"
              cornerRadius={10}
              label={false}
              background={{ fill: "#e5e7eb" }}
              fill="#ff7a59"
              className="stroke-transparent stroke-2"
            />
            
            {/* Manually add text elements instead of using Label component */}
            <text x={125} y={100} textAnchor="middle" dominantBaseline="middle" fill="#ff7a59" fontSize="32" fontWeight="700">
              {percentage}%
            </text>
            <text x={125} y={130} textAnchor="middle" dominantBaseline="middle" fill="#718096" fontSize="14">
              Used
            </text>
          </RadialBarChart>
        </div>
      </CardContent>
      <div className="p-3 pt-0 text-center">
        <div className="text-xl font-bold text-buddha-orange mb-1">
          {used.toLocaleString()} / {total.toLocaleString()}
        </div>
        <div className="flex justify-center gap-4 mb-2">
          <p className="text-buddha-gray-600 text-sm">
            <span className="font-medium">Plan:</span> {planName}
          </p>
          <p className="text-buddha-gray-600 text-sm">
            <span className="font-medium">Resets:</span> June 30
          </p>
        </div>
        
        {percentage >= 80 && (
          <div className="bg-buddha-orange-light border-l-2 border-buddha-orange p-2 rounded-buddha mb-2">
            <p className="text-buddha-gray-800 text-xs">
              {percentage >= 90 
                ? "Approaching limit! Upgrade now."
                : "80% used. Consider upgrading."}
            </p>
          </div>
        )}
        
        <button className="btn-buddha text-xs py-1 px-4 mb-0">
          Upgrade Plan
        </button>
      </div>
    </Card>
  );
};

export default SubmissionLimitInfo; 