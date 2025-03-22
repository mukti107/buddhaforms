"use client";  // Add this directive at the top

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Form, mockForms, getSubmissionsByForm } from '../../lib/mockData';

export default function FormsPage() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formName, setFormName] = useState('');
  const [emailTo, setEmailTo] = useState('');
  
  // Use mock data from our mockData file
  const forms = mockForms.map(form => ({
    formId: form.id,
    name: form.name,
    emailTo: 'contact@example.com', // Add default email since mockForms doesn't have this
    createdAt: form.createdAt || new Date('2023-04-15'), // Use createdAt if present or default date
    submissionCount: form.submissionCount,
    active: form.active
  }));

  const handleDelete = (formId: string) => {
    // In a real app, you would call an API to delete the form
    alert(`Delete form with ID: ${formId}`);
  };

  // Format date for display
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  const handleCreateForm = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formName.trim() || !emailTo.trim()) {
      alert('Please fill out all fields');
      return;
    }
    
    // In a real app, you would call an API to create the form
    console.log('Creating form:', { name: formName, emailTo });
    
    // Mock the creation by generating a form ID
    const newFormId = `form${forms.length + 1}`;
    
    // Reset form and close modal
    setFormName('');
    setEmailTo('');
    setIsModalOpen(false);
    
    // In a real app, you might refresh data or navigate to the new form
    alert(`Form "${formName}" created successfully!`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-hubspot-blue-dark">My Forms</h1>
          <p className="text-hubspot-gray-600 mt-1 text-sm">
            Manage all your forms and their submissions
          </p>
        </div>
      </div>
      
      {forms.length === 0 ? (
        <div className="card-hubspot text-center p-8">
          <svg className="h-12 w-12 text-hubspot-gray-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h2 className="text-xl font-semibold text-hubspot-blue-dark mb-2">No forms created yet</h2>
          <p className="text-hubspot-gray-600 mb-6 text-sm">
            Create your first form to start collecting submissions from your website.
          </p>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="btn-hubspot text-sm"
          >
            Create Your First Form
          </button>
        </div>
      ) : (
        <div className="card-hubspot overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-hubspot-gray-200">
              <thead className="bg-hubspot-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-hubspot-gray-500 uppercase tracking-wider">
                    Form Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-hubspot-gray-500 uppercase tracking-wider">
                    Email Recipients
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-hubspot-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-hubspot-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-hubspot-gray-500 uppercase tracking-wider">
                    Submissions
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-hubspot-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-hubspot-gray-200">
                {forms.map((form) => (
                  <tr key={form.formId} className="hover:bg-hubspot-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-hubspot-blue-dark">{form.name}</div>
                      <div className="text-xs text-hubspot-gray-500 mt-1">ID: {form.formId}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-hubspot-gray-700">{form.emailTo}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-hubspot-gray-700">
                        {formatDate(form.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        form.active 
                          ? 'bg-hubspot-green-light text-hubspot-green-dark' 
                          : 'bg-hubspot-gray-200 text-hubspot-gray-700'
                      }`}>
                        {form.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link 
                        href={`/dashboard/submissions?formId=${form.formId}`}
                        className="text-hubspot-orange hover:text-hubspot-orange-dark text-sm font-medium"
                      >
                        {getSubmissionsByForm(form.formId).length} Submissions
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                      <Link 
                        href={`/dashboard/forms/${form.formId}`}
                        className="text-hubspot-orange hover:text-hubspot-orange-dark"
                      >
                        View
                      </Link>
                      <Link 
                        href={`/dashboard/forms/${form.formId}/edit`}
                        className="text-hubspot-orange hover:text-hubspot-orange-dark"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        className="text-hubspot-orange hover:text-hubspot-orange-dark"
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
      <div className="card-hubspot">
        <h2 className="text-lg font-medium text-hubspot-blue-dark mb-4">Quick Integration Guide</h2>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 space-y-4">
            <p className="text-hubspot-gray-700">
              Easily collect form submissions from your website by using your unique form endpoint.
            </p>
            <div className="bg-hubspot-gray-50 p-4 rounded-hubspot border border-hubspot-gray-200">
              <div className="text-sm font-mono text-hubspot-gray-800">
                <code>https://api.buddhaforms.com/submit/YOUR_FORM_ID</code>
              </div>
            </div>
          </div>
          <div className="flex-1 space-y-4">
            <h3 className="font-medium text-hubspot-blue-dark">Need help?</h3>
            <div className="space-y-2">
              <a href="https://docs.buddhaforms.com" target="_blank" rel="noopener noreferrer" className="text-hubspot-orange hover:text-hubspot-orange-dark flex items-center gap-1">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Documentation</span>
              </a>
              <a href="mailto:support@buddhaforms.com" className="text-hubspot-orange hover:text-hubspot-orange-dark flex items-center gap-1">
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
          <div className="bg-white rounded-hubspot-lg shadow-hubspot-lg max-w-md w-full mx-auto">
            <div className="px-6 py-4 border-b border-hubspot-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-hubspot-blue-dark">Create New Form</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-hubspot-gray-500 hover:text-hubspot-gray-700"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleCreateForm} className="p-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="formName" className="block text-sm font-medium text-hubspot-gray-700 mb-1">
                    Form Name
                  </label>
                  <input
                    type="text"
                    id="formName"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full px-3 py-2 border border-hubspot-gray-300 rounded-hubspot text-hubspot-gray-700 focus:outline-none focus:ring-2 focus:ring-hubspot-orange focus:border-transparent"
                    placeholder="Contact Form"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="emailTo" className="block text-sm font-medium text-hubspot-gray-700 mb-1">
                    Send Notifications To
                  </label>
                  <input
                    type="email"
                    id="emailTo"
                    value={emailTo}
                    onChange={(e) => setEmailTo(e.target.value)}
                    className="w-full px-3 py-2 border border-hubspot-gray-300 rounded-hubspot text-hubspot-gray-700 focus:outline-none focus:ring-2 focus:ring-hubspot-orange focus:border-transparent"
                    placeholder="email@example.com"
                    required
                  />
                  <p className="mt-1 text-xs text-hubspot-gray-500">
                    Form submissions will be sent to this email address.
                  </p>
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-hubspot-secondary text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-hubspot text-sm"
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