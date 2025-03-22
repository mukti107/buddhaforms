"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';

export default function FormDetailPage({
  params
}: {
  params: Promise<{ formId: string }>
}) {
  const router = useRouter();
  // Use React.use() to unwrap the Promise-based params
  const { formId } = React.use(params);
  
  // Mock data for forms
  const mockForms = [
    {
      formId: 'form1',
      name: 'Contact Form',
      emailTo: 'contact@example.com',
      createdAt: '2023-05-15T10:30:00Z',
      active: true,
    },
    {
      formId: 'form2',
      name: 'Feedback Survey',
      emailTo: 'feedback@example.com',
      createdAt: '2023-06-20T14:45:00Z',
      active: true,
    },
    {
      formId: 'form3',
      name: 'Event Registration',
      emailTo: 'events@example.com',
      createdAt: '2023-07-10T09:15:00Z',
      active: false,
    },
  ];

  // Mock data for submissions
  const mockSubmissions = [
    {
      id: 'sub1',
      formId: 'form1',
      data: { name: 'John Doe', email: 'john@example.com', message: 'I need help with my order' },
      createdAt: '2023-08-01T11:20:00Z',
    },
    {
      id: 'sub2',
      formId: 'form1',
      data: { name: 'Jane Smith', email: 'jane@example.com', message: 'Your product is amazing!' },
      createdAt: '2023-08-02T09:15:00Z',
    },
    {
      id: 'sub3',
      formId: 'form1',
      data: { name: 'Mike Johnson', email: 'mike@example.com', message: 'Need technical support' },
      createdAt: '2023-08-03T15:45:00Z',
    },
    {
      id: 'sub4',
      formId: 'form2',
      data: { rating: '5', feedback: 'Great experience', suggestions: 'None at the moment' },
      createdAt: '2023-08-01T10:30:00Z',
    },
    {
      id: 'sub5',
      formId: 'form3',
      data: { attendee: 'Sarah Wilson', email: 'sarah@example.com', guests: ['Tom', 'Lisa'] },
      createdAt: '2023-08-01T14:20:00Z',
    },
    {
      id: 'sub6',
      formId: 'form1',
      data: { name: 'Robert Brown', email: 'robert@example.com', message: 'Question about pricing' },
      createdAt: '2023-08-04T16:30:00Z',
    },
    {
      id: 'sub7',
      formId: 'form1',
      data: { name: 'Emma Davis', email: 'emma@example.com', message: 'Feature request' },
      createdAt: '2023-08-05T13:45:00Z',
    },
  ];
  
  const form = mockForms.find(f => f.formId === formId);
  
  if (!form) {
    return (
      <div className="card-hubspot text-center p-8">
        <h1 className="text-xl font-semibold text-hubspot-blue-dark mb-4">Form Not Found</h1>
        <p className="mb-6 text-hubspot-gray-600 text-sm">The form you're looking for doesn't exist or has been deleted.</p>
        <Link href="/dashboard/forms" className="btn-hubspot text-sm">
          Return to Forms
        </Link>
      </div>
    );
  }
  
  // Get recent submissions for this form
  const recentSubmissions = mockSubmissions
    .filter(sub => sub.formId === formId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
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
          <h1 className="text-2xl font-semibold text-hubspot-blue-dark">{form.name}</h1>
          <p className="text-hubspot-gray-600 text-sm">Created on {formatDate(form.createdAt)}</p>
        </div>
        <div className="flex gap-3">
          <button className="btn-hubspot-secondary flex items-center gap-1 text-sm">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            <span>Edit Form</span>
          </button>
          <Link href={`/dashboard/forms/${formId}/submissions`} className="btn-hubspot text-sm">
            View All Submissions
          </Link>
        </div>
      </div>

      {/* Status badge */}
      <div className="flex">
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
          form.active 
            ? 'bg-hubspot-green-light text-hubspot-green-dark' 
            : 'bg-hubspot-gray-200 text-hubspot-gray-700'
        }`}>
          {form.active ? 'Active' : 'Inactive'}
        </span>
      </div>

      {/* Content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form stats */}
        <div className="card-hubspot">
          <h2 className="text-lg font-medium text-hubspot-blue-dark mb-4">Form Statistics</h2>
          <div className="space-y-4">
            <div className="flex flex-col">
              <span className="text-hubspot-gray-600 text-xs">Total Submissions</span>
              <span className="text-xl font-semibold text-hubspot-blue-dark">
                {recentSubmissions.length}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-hubspot-gray-600 text-xs">Notifications Sent To</span>
              <span className="text-hubspot-blue-dark font-medium text-sm">{form.emailTo}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-hubspot-gray-600 text-xs">Form Status</span>
              <span className={`font-medium text-sm ${form.active ? 'text-hubspot-green' : 'text-hubspot-gray-500'}`}>
                {form.active ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>

        {/* Integration code */}
        <div className="card-hubspot lg:col-span-2">
          <h2 className="text-lg font-medium text-hubspot-blue-dark mb-4">Integration Code</h2>
          <div className="bg-hubspot-gray-50 p-4 rounded-hubspot border border-hubspot-gray-200 overflow-x-auto">
            <pre className="text-sm text-hubspot-gray-800 whitespace-pre-wrap">
{`<form action="https://api.buddhaforms.com/submit/${formId}" method="post">
  <input type="text" name="name" placeholder="Your name" required />
  <input type="email" name="email" placeholder="Your email" required />
  <textarea name="message" placeholder="Your message" required></textarea>
  <button type="submit">Send</button>
</form>`}
            </pre>
          </div>
          <div className="mt-4 flex gap-3">
            <button className="btn-hubspot-secondary text-sm flex items-center gap-1">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span>Copy Code</span>
            </button>
            <button className="btn-hubspot-secondary text-sm flex items-center gap-1">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>Download</span>
            </button>
          </div>
        </div>

        {/* Recent submissions */}
        <div className="card-hubspot lg:col-span-3">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-hubspot-blue-dark">Recent Submissions</h2>
            <Link href={`/dashboard/forms/${formId}/submissions`} className="text-hubspot-orange hover:text-hubspot-orange-dark text-sm font-medium">
              View All
            </Link>
          </div>
          
          {recentSubmissions.length === 0 ? (
            <div className="text-center py-8 border border-dashed border-hubspot-gray-300 rounded-hubspot bg-hubspot-gray-50">
              <svg className="h-12 w-12 text-hubspot-gray-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p className="text-hubspot-gray-600 text-sm">No submissions yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto -mx-6">
              <table className="min-w-full divide-y divide-hubspot-gray-200">
                <thead className="bg-hubspot-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-hubspot-gray-500 uppercase tracking-wider">
                      Submission Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-hubspot-gray-500 uppercase tracking-wider">
                      Data
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-hubspot-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-hubspot-gray-200">
                  {recentSubmissions.map((submission) => (
                    <tr key={submission.id} className="hover:bg-hubspot-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-hubspot-gray-600">
                        {formatDate(submission.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-sm text-hubspot-gray-800">
                        <div className="max-w-md overflow-hidden">
                          {Object.entries(submission.data).map(([key, value]) => (
                            <div key={key} className="mb-1">
                              <span className="font-medium text-hubspot-blue-dark">{key}: </span>
                              <span>{typeof value === 'string' ? value : JSON.stringify(value)}</span>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <button className="text-hubspot-orange hover:text-hubspot-orange-dark font-medium">
                          View Details
                        </button>
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