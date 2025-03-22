"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function SubmissionsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const formIdParam = searchParams?.get('formId');
  
  const [selectedFormId, setSelectedFormId] = useState<string>(formIdParam || '');
  
  // Mock forms data
  const forms = [
    {
      formId: 'form1',
      name: 'Contact Form',
      emailTo: 'contact@example.com',
      active: true,
    },
    {
      formId: 'form2',
      name: 'Feedback Survey',
      emailTo: 'feedback@example.com',
      active: true,
    },
    {
      formId: 'form3',
      name: 'Event Registration',
      emailTo: 'events@example.com',
      active: false,
    },
  ];
  
  // Mock submissions data
  const allSubmissions = [
    {
      id: 'sub1',
      formId: 'form1',
      formName: 'Contact Form',
      submittedAt: new Date('2023-08-05T14:30:00Z'),
      data: {
        name: 'John Doe',
        email: 'john@example.com',
        message: 'I have a question about your services.',
      },
    },
    {
      id: 'sub2',
      formId: 'form2',
      formName: 'Feedback Survey',
      submittedAt: new Date('2023-08-04T10:15:00Z'),
      data: {
        rating: '5',
        comments: 'Great experience!',
        improvements: 'None at the moment.',
      },
    },
    {
      id: 'sub3',
      formId: 'form1',
      formName: 'Contact Form',
      submittedAt: new Date('2023-08-03T18:20:00Z'),
      data: {
        name: 'Jane Smith',
        email: 'jane@example.com',
        message: 'Please contact me regarding your premium plan.',
      },
    },
    {
      id: 'sub4',
      formId: 'form3',
      formName: 'Event Registration',
      submittedAt: new Date('2023-08-02T09:45:00Z'),
      data: {
        name: 'Mike Johnson',
        email: 'mike@example.com',
        event: 'Annual Conference',
        guests: 2,
      },
    },
  ];

  // Filter submissions based on selected form
  const submissions = selectedFormId 
    ? allSubmissions.filter(sub => sub.formId === selectedFormId)
    : allSubmissions;
  
  // Get the selected form details
  const selectedForm = forms.find(form => form.formId === selectedFormId);

  const handleFormChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newFormId = e.target.value;
    setSelectedFormId(newFormId);
    
    if (newFormId) {
      router.push(`/dashboard/submissions?formId=${newFormId}`);
    } else {
      router.push('/dashboard/submissions');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-hubspot-blue-dark">
            {selectedForm ? `Submissions for ${selectedForm.name}` : 'All Submissions'}
          </h1>
          <p className="text-hubspot-gray-600 mt-1 text-sm">
            {selectedForm 
              ? `View all form submissions for ${selectedForm.name}`
              : 'View submissions from all your forms'}
          </p>
        </div>
        
        {/* Form selector */}
        <div className="flex items-center gap-2">
          <label htmlFor="formSelect" className="text-xs text-hubspot-gray-600">
            Filter by form:
          </label>
          <select 
            id="formSelect"
            className="border border-hubspot-gray-300 rounded-md px-3 py-1.5 text-sm text-hubspot-gray-700"
            value={selectedFormId}
            onChange={handleFormChange}
          >
            <option value="">All Forms</option>
            {forms.map((form) => (
              <option key={form.formId} value={form.formId}>
                {form.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {submissions.length === 0 ? (
        <div className="card-hubspot text-center p-8">
          <svg className="h-12 w-12 text-hubspot-gray-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <h2 className="text-xl font-semibold text-hubspot-blue-dark mb-2">No submissions found</h2>
          <p className="text-hubspot-gray-600 mb-6 text-sm">
            {selectedForm 
              ? `No one has submitted the ${selectedForm.name} form yet.`
              : 'No form submissions have been received yet.'}
          </p>
          <Link 
            href="/dashboard/forms" 
            className="btn-hubspot text-sm"
          >
            Go to Forms
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {submissions.map((submission, index) => {
            const form = forms.find(f => f.formId === submission.formId);
            return (
              <div key={index} className="card-hubspot p-0 overflow-hidden">
                <div className="px-6 py-4 bg-hubspot-gray-50 border-b border-hubspot-gray-200 flex justify-between items-center">
                  <div>
                    <h2 className="font-medium text-hubspot-blue-dark text-base">
                      {form?.name || 'Unknown Form'}
                    </h2>
                    <p className="text-xs text-hubspot-gray-500">
                      Submitted on {submission.submittedAt.toLocaleString()}
                    </p>
                  </div>
                  {!selectedFormId && (
                    <Link 
                      href={`/dashboard/submissions?formId=${submission.formId}`}
                      className="text-hubspot-orange hover:text-hubspot-orange-dark text-sm"
                    >
                      View all from this form →
                    </Link>
                  )}
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(submission.data).map(([key, value]) => (
                      <div key={key} className="flex flex-col">
                        <span className="text-xs text-hubspot-gray-500 uppercase mb-1">{key}</span>
                        <span className="text-sm text-hubspot-gray-800">
                          {typeof value === 'string' ? value : JSON.stringify(value)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="px-6 py-3 bg-hubspot-gray-50 border-t border-hubspot-gray-200 flex justify-end">
                  <button className="text-hubspot-orange hover:text-hubspot-orange-dark text-sm font-medium">
                    View Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
} 