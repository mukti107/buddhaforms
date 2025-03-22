import React, { ReactNode } from 'react';

interface PageHeaderProps {
  heading: string;
  subheading?: string;
  children?: ReactNode;
}

export function PageHeader({ heading, subheading, children }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-5 mb-5 border-b border-hubspot-gray-200">
      <div>
        <h1 className="text-2xl font-semibold text-hubspot-blue-dark">{heading}</h1>
        {subheading && (
          <p className="mt-1 text-hubspot-gray-600">{subheading}</p>
        )}
      </div>
      {children && (
        <div className="mt-4 sm:mt-0">
          {children}
        </div>
      )}
    </div>
  );
} 