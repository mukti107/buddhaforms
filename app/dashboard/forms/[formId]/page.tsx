"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';
import { mockForms, mockSubmissions, getSubmissionsByForm } from '@/app/lib/mockData';
import PageHeader from '@/app/components/PageHeader';

export default function FormDetailPage({
  params
}: {
  params: Promise<{ formId: string }>
}) {
  const router = useRouter();
  // Use React.use() to unwrap the Promise-based params
  const { formId } = React.use(params);
  
  // Find the form in our centralized mock data
  const form = mockForms.find(f => f.id === formId);
  
  if (!form) {
    return (
      <div className="card-buddha text-center p-8">
        <h1 className="text-xl font-semibold text-buddha-blue-dark mb-4">Form Not Found</h1>
        <p className="mb-6 text-buddha-gray-600 text-sm">The form you're looking for doesn't exist or has been deleted.</p>
        <Link href="/dashboard/forms" className="btn-buddha text-sm">
          Return to Forms
        </Link>
      </div>
    );
  }
  
  // Get recent submissions for this form
  const formSubmissions = getSubmissionsByForm(formId);
  const recentSubmissions = [...formSubmissions]
    .sort((a, b) => b.submittedAt.getTime() - a.submittedAt.getTime())
    .slice(0, 5);

  // Format date for display
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    }).format(date);
  };

  // Define the icons for the actions
  const editIcon = (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
    </svg>
  );

  return (
    <div className="space-y-6">
      {/* Header - Using PageHeader component */}
      <PageHeader
        title={form.name}
        description={`Created on ${formatDate(form.createdAt || new Date())}`}
        actions={[
          {
            label: "Edit Form",
            href: `/dashboard/forms/${formId}/edit`,
            isPrimary: false,
            icon: editIcon
          },
          {
            label: "View All Submissions",
            href: `/dashboard/submissions?formId=${formId}`,
            isPrimary: true
          }
        ]}
      />

      {/* Content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form stats */}
        <div className="card-buddha">
          <h2 className="text-lg font-medium text-buddha-blue-dark mb-4">Form Statistics</h2>
          <div className="space-y-4">
            <div className="flex flex-col">
              <span className="text-buddha-gray-600 text-xs">Total Submissions</span>
              <span className="text-xl font-semibold text-buddha-blue-dark">
                {form.submissionCount || recentSubmissions.length}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-buddha-gray-600 text-xs">Notifications Sent To</span>
              <span className="text-buddha-blue-dark font-medium text-sm">
                {form.settings?.emailNotifications ? 'Enabled' : 'Disabled'}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-buddha-gray-600 text-xs">Form Status</span>
              <span className={`font-medium text-sm ${form.active ? 'text-buddha-green' : 'text-buddha-gray-500'}`}>
                {form.active ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>

        {/* Integration code */}
        <div className="card-buddha lg:col-span-2">
          <h2 className="text-lg font-medium text-buddha-blue-dark mb-4">Integration Code</h2>
          <div className="bg-buddha-gray-50 p-4 rounded-buddha border border-buddha-gray-200 overflow-x-auto">
            <p className="text-sm text-buddha-gray-700 mb-2">Use this form action URL in your HTML form:</p>
            <div className="text-sm font-mono text-buddha-gray-800 p-2 bg-white border border-buddha-gray-200 rounded-buddha">
              <code>https://api.buddhaforms.com/submit/{formId}</code>
            </div>
          </div>
          <div className="mt-4 flex gap-3">
            <button className="btn-buddha-secondary text-sm flex items-center gap-1">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span>Copy URL</span>
            </button>
          </div>
        </div>

        {/* Recent submissions */}
        <div className="card-buddha lg:col-span-3">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-buddha-blue-dark">Recent Submissions</h2>
            <Link href={`/dashboard/forms/${formId}/submissions`} className="text-buddha-orange hover:text-buddha-orange-dark text-sm font-medium">
              View All
            </Link>
          </div>
          
          {recentSubmissions.length === 0 ? (
            <div className="text-center py-8 border border-dashed border-buddha-gray-300 rounded-buddha bg-buddha-gray-50">
              <svg className="h-12 w-12 text-buddha-gray-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p className="text-buddha-gray-600 text-sm">No submissions yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto -mx-6">
              <table className="min-w-full divide-y divide-buddha-gray-200">
                <thead className="bg-buddha-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-buddha-gray-500 uppercase tracking-wider">
                      Submission Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-buddha-gray-500 uppercase tracking-wider">
                      Data
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-buddha-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-buddha-gray-200">
                  {recentSubmissions.map((submission) => (
                    <tr key={submission.id} className="hover:bg-buddha-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-buddha-gray-600">
                        {formatDate(submission.submittedAt)}
                      </td>
                      <td className="px-6 py-4 text-sm text-buddha-gray-800">
                        <div className="max-w-md overflow-hidden">
                          {Object.entries(submission.data).map(([key, value]) => (
                            <div key={key} className="mb-1">
                              <span className="font-medium text-buddha-blue-dark">{key}: </span>
                              <span>{typeof value === 'string' ? value : JSON.stringify(value)}</span>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <Link 
                          href={`/dashboard/submissions/${submission.id}`}
                          className="text-buddha-orange hover:text-buddha-orange-dark font-medium"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 