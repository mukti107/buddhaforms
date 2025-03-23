"use client";

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import React from 'react';
import useSWR, { mutate } from 'swr';
import PageHeader from '@/app/components/PageHeader';

interface Submission {
  id: string;
  formId: string;
  data: Record<string, any>;
  submittedAt: string;
  ip?: string;
  userAgent?: string;
  referrer?: string;
  isSpam: boolean;
  form?: {
    name: string;
    emailTo: string;
  };
}

// Fetcher function for SWR
const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function SubmissionDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { submissionId } = params;

  const { data, error, isLoading } = useSWR<{ submission: Submission }>(
    `/api/submissions/${submissionId}`,
    fetcher
  );

  const submission = data?.submission;

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    }).format(new Date(dateString));
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this submission?')) {
      return;
    }

    try {
      const response = await fetch(`/api/submissions/${submissionId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete submission');
      }

      // Revalidate submissions list
      mutate('/api/submissions');
      
      // Navigate back to submissions list
      router.push('/dashboard/submissions');
    } catch (err) {
      console.error(err);
      alert('Failed to delete submission. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="card-parrot text-center p-8">
        <p className="text-parrot-gray-600">Loading submission details...</p>
      </div>
    );
  }

  if (error || !submission) {
    return (
      <div className="card-parrot text-center p-8">
        <h1 className="text-xl font-semibold text-parrot-blue-dark mb-4">Submission Not Found</h1>
        <p className="mb-6 text-parrot-gray-600 text-sm">
          The submission you're looking for doesn't exist or has been deleted.
        </p>
        <Link href="/dashboard/submissions" className="btn-parrot text-sm">
          Return to Submissions
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Submission Details"
        description={`From ${submission.form?.name || 'Unknown Form'}`}
        actions={[
          {
            label: "Delete",
            onClick: handleDelete,
            isPrimary: false,
            className: "text-red-600 hover:text-red-700"
          },
          {
            label: "Back to Submissions",
            href: "/dashboard/submissions",
            isPrimary: false
          }
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Submission Data */}
        <div className="lg:col-span-2 card-parrot">
          <h2 className="text-lg font-medium text-parrot-blue-dark mb-4">Form Data</h2>
          <div className="space-y-4">
            {Object.entries(submission.data).map(([key, value]) => (
              <div key={key} className="border-b border-parrot-gray-200 pb-4 last:border-0">
                <label className="block text-sm font-medium text-parrot-gray-700 mb-1">
                  {key}
                </label>
                <div className="text-parrot-gray-900 break-words">
                  {typeof value === 'string' ? value : JSON.stringify(value, null, 2)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submission Details */}
        <div className="card-parrot">
          <h2 className="text-lg font-medium text-parrot-blue-dark mb-4">Submission Details</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-parrot-gray-700 mb-1">
                Submission Date
              </label>
              <div className="text-parrot-gray-900">
                {formatDate(submission.submittedAt)}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-parrot-gray-700 mb-1">
                Status
              </label>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                submission.isSpam 
                  ? 'bg-red-100 text-red-800'
                  : 'bg-green-100 text-green-800'
              }`}>
                {submission.isSpam ? 'Spam' : 'Valid'}
              </span>
            </div>
            {submission.ip && (
              <div>
                <label className="block text-sm font-medium text-parrot-gray-700 mb-1">
                  IP Address
                </label>
                <div className="text-parrot-gray-900">{submission.ip}</div>
              </div>
            )}
            {submission.referrer && (
              <div>
                <label className="block text-sm font-medium text-parrot-gray-700 mb-1">
                  Referrer
                </label>
                <div className="text-parrot-gray-900 break-words">{submission.referrer}</div>
              </div>
            )}
            {submission.userAgent && (
              <div>
                <label className="block text-sm font-medium text-parrot-gray-700 mb-1">
                  User Agent
                </label>
                <div className="text-parrot-gray-900 break-words">{submission.userAgent}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 