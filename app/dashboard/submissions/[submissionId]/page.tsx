"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';
import { mockSubmissions } from '@/app/lib/mockData';

export default function SubmissionDetailPage({
  params
}: {
  params: Promise<{ submissionId: string }>
}) {
  const router = useRouter();
  // Use React.use() to unwrap the Promise-based params
  const { submissionId } = React.use(params);
  
  const submission = mockSubmissions.find(sub => sub.id === submissionId);
  
  if (!submission) {
    return (
      <div className="card-hubspot text-center p-8">
        <h1 className="text-xl font-semibold text-hubspot-blue-dark mb-4">Submission Not Found</h1>
        <p className="mb-6 text-hubspot-gray-600 text-sm">The submission you're looking for doesn't exist or has been deleted.</p>
        <Link href="/dashboard/submissions" className="btn-hubspot text-sm">
          Return to Submissions
        </Link>
      </div>
    );
  }
  
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-hubspot-blue-dark">Submission Details</h1>
          <p className="text-hubspot-gray-600 text-sm">Received on {formatDate(submission.submittedAt)}</p>
        </div>
        <div className="flex gap-3">
          <Link 
            href={`/dashboard/forms/${submission.formId}`} 
            className="btn-hubspot-secondary text-sm flex items-center gap-1"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            <span>View Form</span>
          </Link>
          <button className="btn-hubspot-secondary text-sm flex items-center gap-1">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Mark as Read</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 gap-6">
        {/* Overview card */}
        <div className="card-hubspot">
          <h2 className="text-lg font-medium text-hubspot-blue-dark mb-4">Submission Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div>
              <div className="space-y-3">
                <div>
                  <p className="text-hubspot-gray-600 text-sm">Form</p>
                  <p className="font-medium text-hubspot-blue-dark">{submission.formName}</p>
                </div>
                <div>
                  <p className="text-hubspot-gray-600 text-sm">Submission ID</p>
                  <p className="font-medium text-hubspot-blue-dark">{submission.id}</p>
                </div>
              </div>
            </div>
            <div>
              <div className="space-y-3">
                <div>
                  <p className="text-hubspot-gray-600 text-sm">Received On</p>
                  <p className="font-medium text-hubspot-blue-dark">{formatDate(submission.submittedAt)}</p>
                </div>
                <div>
                  <p className="text-hubspot-gray-600 text-sm">Status</p>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-hubspot-green-light text-hubspot-green-dark">
                    {submission.read ? 'Read' : 'New'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Submission data card */}
        <div className="card-hubspot">
          <h2 className="text-lg font-medium text-hubspot-blue-dark mb-4">Submission Data</h2>
          <div className="space-y-6">
            {Object.entries(submission.data).map(([key, value]) => (
              <div key={key} className="border-b border-hubspot-gray-200 pb-4 last:border-0 last:pb-0">
                <p className="text-hubspot-gray-600 text-sm mb-1 capitalize">{key}</p>
                <div className="font-medium text-hubspot-blue-dark">
                  {typeof value === 'string' ? (
                    value
                  ) : Array.isArray(value) ? (
                    <ul className="list-disc list-inside">
                      {value.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    JSON.stringify(value)
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center">
          <div className="flex gap-3">
            <button className="btn-danger text-sm flex items-center gap-1">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span>Delete Submission</span>
            </button>
            <button className="btn-hubspot-secondary text-sm flex items-center gap-1">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12" />
              </svg>
              <span>Export Data</span>
            </button>
          </div>
          <Link href="/dashboard/submissions" className="text-hubspot-orange hover:text-hubspot-orange-dark text-sm font-medium">
            Back to All Submissions
          </Link>
        </div>
      </div>
    </div>
  );
} 