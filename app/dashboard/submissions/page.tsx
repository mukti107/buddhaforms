"use client";

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { mockForms, mockSubmissions } from '@/app/lib/mockData';
import PageHeader from '@/app/components/PageHeader';

export default function SubmissionsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const formIdFilter = searchParams.get('formId');
  
  // Filter submissions if a formId is provided
  const filteredSubmissions = formIdFilter 
    ? mockSubmissions.filter(sub => sub.formId === formIdFilter)
    : mockSubmissions;
    
  // Sort by newest first
  const sortedSubmissions = [...filteredSubmissions].sort(
    (a, b) => b.submittedAt.getTime() - a.submittedAt.getTime()
  );

  // Get form name if filtering by form
  const formName = formIdFilter 
    ? mockForms.find(form => form.id === formIdFilter)?.name || 'Unknown Form'
    : null;

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

  // Get a preview of the submission data
  const getSubmissionPreview = (data: Record<string, any>) => {
    // If there's a name field, use that
    if (data.name) return data.name;
    // If there's an email field, use that
    if (data.email) return data.email;
    // If there's a subject or title field, use that
    if (data.subject) return data.subject;
    if (data.title) return data.title;
    
    // Otherwise, use the first field that's a string and not too long
    for (const [key, value] of Object.entries(data)) {
      if (typeof value === 'string' && value.length < 50) {
        return value;
      }
    }
    
    // If nothing else works, just show "View details"
    return "View details";
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={formIdFilter ? `${formName} Submissions` : 'All Submissions'}
        description={formIdFilter 
          ? `Viewing submissions for ${formName}`
          : 'View and manage all form submissions across your account'
        }
        actions={formIdFilter ? [
          {
            label: "View All Submissions",
            href: "/dashboard/submissions",
            isPrimary: false
          }
        ] : []}
      />
      
      {sortedSubmissions.length === 0 ? (
        <div className="card-hubspot text-center p-8">
          <svg className="h-12 w-12 text-hubspot-gray-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <h2 className="text-xl font-semibold text-hubspot-blue-dark mb-2">No submissions found</h2>
          <p className="text-hubspot-gray-600 mb-6 text-sm">
            {formIdFilter 
              ? `There are no submissions yet for ${formName}.`
              : 'Once your forms receive submissions, they will appear here.'
            }
          </p>
        </div>
      ) : (
        <div className="card-hubspot overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-hubspot-gray-200">
              <thead className="bg-hubspot-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-hubspot-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  {!formIdFilter && (
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-hubspot-gray-500 uppercase tracking-wider">
                      Form
                    </th>
                  )}
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-hubspot-gray-500 uppercase tracking-wider">
                    Preview
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-hubspot-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-hubspot-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-hubspot-gray-200">
                {sortedSubmissions.map((submission) => (
                  <tr key={submission.id} className={`hover:bg-hubspot-gray-50 ${!submission.read ? 'bg-hubspot-orange-50' : ''}`}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-hubspot-gray-600">
                      {formatDate(submission.submittedAt)}
                    </td>
                    {!formIdFilter && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link 
                          href={`/dashboard/forms/${submission.formId}`}
                          className="text-hubspot-blue-dark hover:text-hubspot-orange font-medium text-sm"
                        >
                          {submission.formName}
                        </Link>
                      </td>
                    )}
                    <td className="px-6 py-4">
                      <div className="text-sm text-hubspot-gray-800 truncate max-w-xs">
                        {getSubmissionPreview(submission.data)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        !submission.read 
                          ? 'bg-hubspot-orange-light text-hubspot-orange-dark' 
                          : 'bg-hubspot-gray-200 text-hubspot-gray-700'
                      }`}>
                        {!submission.read ? 'New' : 'Read'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <Link 
                        href={`/dashboard/submissions/${submission.id}`}
                        className="text-hubspot-orange hover:text-hubspot-orange-dark font-medium"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
} 