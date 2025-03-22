"use client";  // Add this directive at the top

import PageHeader from '@/app/components/PageHeader';
import Link from 'next/link';
import { useState } from 'react';
import useSWR, { mutate } from 'swr';

interface Form {
  formId: string;
  name: string;
  emailTo: string;
  createdAt: string;
  active: boolean;
  submissionCount: number;
}

// Fetcher function for SWR
const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function FormsPage() {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formName, setFormName] = useState('');
  const [emailTo, setEmailTo] = useState('');
  
  // Use SWR for data fetching
  const { data, error, isLoading } = useSWR('/api/forms', fetcher);
  const forms = data?.forms || [];

  const handleDelete = async (formId: string) => {
    if (!confirm('Are you sure you want to delete this form?')) {
      return;
    }

    try {
      const response = await fetch(`/api/forms/${formId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete form');
      }

      // Revalidate the forms list
      mutate('/api/forms');
    } catch (err) {
      console.error(err);
      alert('Failed to delete form. Please try again.');
    }
  };

  // Format date for display
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  const handleCreateForm = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formName.trim() || !emailTo.trim()) {
      alert('Please fill out all fields');
      return;
    }
    
    try {
      const response = await fetch('/api/forms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: formName, emailTo }),
      });

      if (!response.ok) {
        throw new Error('Failed to create form');
      }

      // Revalidate the forms list
      mutate('/api/forms');
      
      // Reset form and close modal
      setFormName('');
      setEmailTo('');
      setIsModalOpen(false);

      // Show success message
      alert(`Form "${formName}" created successfully!`);
    } catch (err) {
      console.error(err);
      alert('Failed to create form. Please try again.');
    }
  };

  // Define icon for create form button (used in modal)
  const createFormIcon = (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  );
  
  // Create Form action
  const handleCreateFormClick = () => {
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="card-buddha text-center p-8">
        <p className="text-buddha-gray-600">Loading forms...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card-buddha text-center p-8">
        <p className="text-red-600">Failed to load forms</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Forms"
        description="Manage all your forms and their submissions"
      />
      
      {forms.length === 0 ? (
        <div className="card-buddha text-center p-8">
          <svg className="h-12 w-12 text-buddha-gray-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h2 className="text-xl font-semibold text-buddha-blue-dark mb-2">No forms created yet</h2>
          <p className="text-buddha-gray-600 mb-6 text-sm">
            Create your first form using the "Create Form" button in the header to get started.
          </p>
        </div>
      ) : (
        <div className="card-buddha overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-buddha-gray-200">
              <thead className="bg-buddha-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-buddha-gray-500 uppercase tracking-wider">
                    Form Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-buddha-gray-500 uppercase tracking-wider">
                    Email Recipients
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-buddha-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-buddha-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-buddha-gray-500 uppercase tracking-wider">
                    Submissions
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-buddha-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-buddha-gray-200">
                {forms.map((form: Form) => (
                  <tr key={form.formId} className="hover:bg-buddha-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-buddha-blue-dark">{form.name}</div>
                      <div className="text-xs text-buddha-gray-500 mt-1">ID: {form.formId}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-buddha-gray-700">{form.emailTo}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-buddha-gray-700">
                        {formatDate(new Date(form.createdAt))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        form.active 
                          ? 'bg-buddha-green-light text-buddha-green-dark' 
                          : 'bg-buddha-gray-200 text-buddha-gray-700'
                      }`}>
                        {form.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link 
                        href={`/dashboard/submissions?formId=${form.formId}`}
                        className="text-buddha-orange hover:text-buddha-orange-dark text-sm font-medium"
                      >
                        {form.submissionCount || 0} Submissions
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                      <Link 
                        href={`/dashboard/forms/${form.formId}`}
                        className="text-buddha-orange hover:text-buddha-orange-dark"
                      >
                        View
                      </Link>
                      <Link 
                        href={`/dashboard/forms/${form.formId}/edit`}
                        className="text-buddha-orange hover:text-buddha-orange-dark"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        className="text-buddha-orange hover:text-buddha-orange-dark"
                        onClick={() => handleDelete(form.formId)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* Integration Guide */}
      <div className="card-buddha">
        <h2 className="text-lg font-medium text-buddha-blue-dark mb-4">Quick Integration Guide</h2>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 space-y-4">
            <p className="text-buddha-gray-700">
              Easily collect form submissions from your website by using your unique form endpoint.
            </p>
            <div className="bg-buddha-gray-50 p-4 rounded-buddha border border-buddha-gray-200">
              <div className="text-sm font-mono text-buddha-gray-800">
                <code>https://api.buddhaforms.com/submit/YOUR_FORM_ID</code>
              </div>
            </div>
          </div>
          <div className="flex-1 space-y-4">
            <h3 className="font-medium text-buddha-blue-dark">Need help?</h3>
            <div className="space-y-2">
              <a href="https://docs.buddhaforms.com" target="_blank" rel="noopener noreferrer" className="text-buddha-orange hover:text-buddha-orange-dark flex items-center gap-1">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Documentation</span>
              </a>
              <a href="mailto:support@buddhaforms.com" className="text-buddha-orange hover:text-buddha-orange-dark flex items-center gap-1">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>Contact Support</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Create Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-buddha-lg shadow-buddha-lg max-w-md w-full mx-auto">
            <div className="px-6 py-4 border-b border-buddha-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-buddha-blue-dark">Create New Form</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-buddha-gray-500 hover:text-buddha-gray-700"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleCreateForm} className="p-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="formName" className="block text-sm font-medium text-buddha-gray-700 mb-1">
                    Form Name
                  </label>
                  <input
                    type="text"
                    id="formName"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full px-3 py-2 border border-buddha-gray-300 rounded-buddha text-buddha-gray-700 focus:outline-none focus:ring-2 focus:ring-buddha-orange focus:border-transparent"
                    placeholder="Contact Form"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="emailTo" className="block text-sm font-medium text-buddha-gray-700 mb-1">
                    Send Notifications To
                  </label>
                  <input
                    type="email"
                    id="emailTo"
                    value={emailTo}
                    onChange={(e) => setEmailTo(e.target.value)}
                    className="w-full px-3 py-2 border border-buddha-gray-300 rounded-buddha text-buddha-gray-700 focus:outline-none focus:ring-2 focus:ring-buddha-orange focus:border-transparent"
                    placeholder="email@example.com"
                    required
                  />
                  <p className="mt-1 text-xs text-buddha-gray-500">
                    Form submissions will be sent to this email address.
                  </p>
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-buddha-secondary text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-buddha text-sm"
                >
                  Create Form
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 