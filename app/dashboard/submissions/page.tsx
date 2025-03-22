"use client";

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import useSWR from 'swr';
import PageHeader from '@/app/components/PageHeader';

interface Submission {
  id: string;
  formId: string;
  data: Record<string, any>;
  submittedAt: string;
  isSpam: boolean;
  form?: {
    name: string;
  };
}

interface PaginationData {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

// Fetcher function for SWR
const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function SubmissionsPage() {
  const searchParams = useSearchParams();
  const formId = searchParams.get('formId');
  const page = searchParams.get('page') || '1';
  const limit = searchParams.get('limit') || '10';

  // Construct API URL with query parameters
  const apiUrl = `/api/submissions?${new URLSearchParams({
    ...(formId && { formId }),
    page,
    limit,
  })}`;

  const { data, error, isLoading } = useSWR<{
    submissions: Submission[];
    pagination: PaginationData;
  }>(apiUrl, fetcher);

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

  if (isLoading) {
    return (
      <div className="card-buddha text-center p-8">
        <p className="text-buddha-gray-600">Loading submissions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card-buddha text-center p-8">
        <p className="text-red-600">Failed to load submissions</p>
      </div>
    );
  }

  const { submissions = [], pagination } = data || {};

  return (
    <div className="space-y-6">
      <PageHeader
        title="Form Submissions"
        description={formId ? "View submissions for this form" : "View all form submissions"}
      />

      {submissions.length === 0 ? (
        <div className="card-buddha text-center p-8">
          <svg className="h-12 w-12 text-buddha-gray-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <h2 className="text-xl font-semibold text-buddha-blue-dark mb-2">No submissions yet</h2>
          <p className="text-buddha-gray-600 mb-6 text-sm">
            Submissions will appear here once your form starts receiving responses.
          </p>
        </div>
      ) : (
        <div className="card-buddha overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-buddha-gray-200">
              <thead className="bg-buddha-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-buddha-gray-500 uppercase tracking-wider">
                    Submission Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-buddha-gray-500 uppercase tracking-wider">
                    Form
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-buddha-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-buddha-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-buddha-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-buddha-gray-200">
                {submissions.map((submission) => (
                  <tr key={submission.id} className="hover:bg-buddha-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-buddha-gray-600">
                      {formatDate(submission.submittedAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-buddha-blue-dark">
                        {submission.form?.name || 'Unknown Form'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-buddha-gray-900 max-w-md overflow-hidden">
                        {Object.entries(submission.data).map(([key, value]) => (
                          <div key={key} className="truncate">
                            <span className="font-medium">{key}:</span>{' '}
                            <span>{typeof value === 'string' ? value : JSON.stringify(value)}</span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        submission.isSpam 
                          ? 'bg-red-100 text-red-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {submission.isSpam ? 'Spam' : 'Valid'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        href={`/dashboard/submissions/${submission.id}`}
                        className="text-buddha-orange hover:text-buddha-orange-dark"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination && pagination.pages > 1 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-buddha-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <Link
                  href={`/dashboard/submissions?page=${Math.max(1, pagination.page - 1)}`}
                  className={`btn-buddha-secondary text-sm ${pagination.page <= 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  Previous
                </Link>
                <Link
                  href={`/dashboard/submissions?page=${Math.min(pagination.pages, pagination.page + 1)}`}
                  className={`btn-buddha-secondary text-sm ${pagination.page >= pagination.pages ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  Next
                </Link>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-buddha-gray-700">
                    Showing <span className="font-medium">{((pagination.page - 1) * pagination.limit) + 1}</span> to{' '}
                    <span className="font-medium">{Math.min(pagination.page * pagination.limit, pagination.total)}</span> of{' '}
                    <span className="font-medium">{pagination.total}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    {/* Add pagination buttons here */}
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 