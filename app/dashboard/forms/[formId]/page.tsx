"use client";

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import React from 'react';
import useSWR from 'swr';
import PageHeader from '@/app/components/PageHeader';
import { getSubmissionUrl } from '@/app/helper';

interface Form {
  formId: string;
  name: string;
  emailTo: string;
  createdAt: string;
  active: boolean;
  settings?: {
    emailNotifications: boolean;
    notificationEmail: string;
    honeypot: boolean;
  };
  submissionCount?: number;
}

interface Submission {
  id: string;
  formId: string;
  submittedAt: string;
  data: Record<string, any>;
}

// Fetcher function for SWR
const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function FormDetailPage() {
  const params = useParams();
  const { formId } = params;
  
  // Use SWR for data fetching
  const { data: formData, error: formError, isLoading: formLoading } = useSWR(
    `/api/forms/${formId}`,
    fetcher
  );

  const { data: submissionsData, error: submissionsError, isLoading: submissionsLoading } = useSWR(
    `/api/submissions?formId=${formId}`,
    fetcher
  );

  const form = formData?.form;
  const formSubmissions = submissionsData?.submissions || [];
  const recentSubmissions = formSubmissions
    .sort((a: Submission, b: Submission) => 
      new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    )
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

  if (formLoading || submissionsLoading) {
    return (
      <div className="card-parrot text-center p-8">
        <p className="text-parrot-gray-600">Loading form details...</p>
      </div>
    );
  }

  if (formError || !form) {
    return (
      <div className="card-parrot text-center p-8">
        <h1 className="text-xl font-semibold text-parrot-blue-dark mb-4">Form Not Found</h1>
        <p className="mb-6 text-parrot-gray-600 text-sm">The form you're looking for doesn't exist or has been deleted.</p>
        <Link href="/dashboard/forms" className="btn-parrot text-sm">
          Return to Forms
        </Link>
      </div>
    );
  }
  
  const endpointUrl = getSubmissionUrl(form.formId);

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
        description="Form details and integration guide"
        actions={[
          {
            label: "Edit Form",
            href: `/dashboard/forms/${formId}/edit`,
            isPrimary: true
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
        <div className="card-parrot">
          <h2 className="text-lg font-medium text-parrot-blue-dark mb-4">Form Statistics</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-parrot-gray-600 text-xs">Total Submissions</span>
                <div className="text-xl font-semibold text-parrot-blue-dark">
                  {form.submissionCount || recentSubmissions.length}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-parrot-gray-600 text-xs">Email Notifications</span>
                <div className="text-sm text-parrot-blue-dark">
                  {form.settings?.emailNotifications ? 'On' : 'Off'}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-parrot-gray-600 text-xs">Notifications Sent To</span>
                <div className="text-sm text-parrot-blue-dark">
                  {form.settings?.notificationEmail || 'No email set'}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-parrot-gray-600 text-xs">Form Status</span>
                <div className="text-sm text-parrot-blue-dark">
                  {form.active ? 'Active' : 'Inactive'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Integration Guide */}
        <div className="card-parrot lg:col-span-2">
          <h2 className="text-lg font-medium text-parrot-blue-dark mb-4">Integration Guide</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-parrot-gray-700 mb-2">Form Endpoint</h3>
              <div className="bg-parrot-gray-50 p-4 rounded-parrot border border-parrot-gray-200">
                <div className="flex items-center justify-between">
                  <code className="text-sm font-mono text-parrot-gray-800">{endpointUrl}</code>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(endpointUrl);
                    }}
                    className="text-parrot-green hover:text-parrot-green-dark text-sm"
                  >
                    Copy
                  </button>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-parrot-gray-700 mb-2">HTML Form Example</h3>
              <div className="bg-parrot-gray-50 p-4 rounded-parrot border border-parrot-gray-200">
                <pre className="text-sm font-mono text-parrot-gray-800 whitespace-pre-wrap">
{`<form action="${endpointUrl}" method="POST">
  <input type="text" name="name" required>
  <input type="email" name="email" required>
  <button type="submit">Submit</button>
</form>`}
                </pre>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-parrot-gray-700 mb-2">JavaScript Fetch Example</h3>
              <div className="bg-parrot-gray-50 p-4 rounded-parrot border border-parrot-gray-200">
                <pre className="text-sm font-mono text-parrot-gray-800 whitespace-pre-wrap">
{`fetch('${endpointUrl}', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com'
  })
})`}
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Recent submissions */}
        <div className="card-parrot lg:col-span-3">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-parrot-blue-dark">Recent Submissions</h2>
            <Link href={`/dashboard/forms/${formId}/submissions`} className="text-parrot-green hover:text-parrot-green-dark text-sm font-medium">
              View All
            </Link>
          </div>
          
          {recentSubmissions.length === 0 ? (
            <div className="text-center py-8 border border-dashed border-parrot-gray-300 rounded-parrot bg-parrot-gray-50">
              <svg className="h-12 w-12 text-parrot-gray-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p className="text-parrot-gray-600 text-sm">No submissions yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto -mx-6">
              <table className="min-w-full divide-y divide-parrot-gray-200">
                <thead className="bg-parrot-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-parrot-gray-500 uppercase tracking-wider">
                      Submission Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-parrot-gray-500 uppercase tracking-wider">
                      Data
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-parrot-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-parrot-gray-200">
                  {recentSubmissions.map((submission: Submission) => (
                    <tr key={submission.id} className="hover:bg-parrot-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-parrot-gray-600">
                        {formatDate(new Date(submission.submittedAt))}
                      </td>
                      <td className="px-6 py-4 text-sm text-parrot-gray-800">
                        <div className="max-w-md overflow-hidden">
                          {Object.entries(submission.data).map(([key, value]) => (
                            <div key={key} className="mb-1">
                              <span className="font-medium text-parrot-blue-dark">{key}: </span>
                              <span>{typeof value === 'string' ? value : JSON.stringify(value)}</span>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <Link 
                          href={`/dashboard/submissions/${submission.id}`}
                          className="text-parrot-green hover:text-parrot-green-dark font-medium"
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