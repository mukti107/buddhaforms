"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { mockForms } from '@/app/lib/mockData';
import PageHeader from '@/app/components/PageHeader';
import { Toggle } from '@/app/components/ui/toggle';

export default function EditFormPage({
  params
}: {
  params: Promise<{ formId: string }>
}) {
  const router = useRouter();
  // Use React.use() to unwrap the Promise-based params
  const { formId } = React.use(params);
  
  // Find form from centralized mock data
  const formData = mockForms.find(f => f.id === formId);
  
  if (!formData) {
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
  
  // State for form fields
  const [name, setName] = useState(formData.name);
  const [active, setActive] = useState(formData.active);
  const [spamProtection, setSpamProtection] = useState(formData.settings?.honeypot || false);
  const [dataRetention, setDataRetention] = useState('forever'); // Default since it's not in mockForms
  const [emailNotifications, setEmailNotifications] = useState(formData.settings?.emailNotifications !== undefined ? formData.settings.emailNotifications : true);
  const [notificationEmail, setNotificationEmail] = useState(formData.settings?.notificationEmail || '');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteChecked, setDeleteChecked] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Generate user-friendly data retention text
  const getDataRetentionText = (value: string) => {
    switch(value) {
      case 'forever': return 'Forever';
      case '30days': return '30 days';
      case '90days': return '90 days';
      case '1year': return '1 year';
      case '3years': return '3 years';
      default: return 'Forever';
    }
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);
    
    // In a real app, you would call an API to update the form
    console.log('Updating form:', { 
      formId, 
      name, 
      active, 
      spamProtection, 
      dataRetention,
      emailNotifications,
      notificationEmail
    });
    
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      setSaveSuccess(true);
      // No longer redirecting
      // router.push(`/dashboard/forms/${formId}`);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    }, 800);
  };
  
  // Handle form deletion
  const handleDeleteForm = () => {
    // In a real app, you would call an API to delete the form
    console.log('Deleting form:', formId);
    
    // Simulate API call
    setTimeout(() => {
      router.push('/dashboard/forms');
    }, 800);
  };

  // Define the save action with loading state
  const saveIcon = (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );

  return (
    <div className="space-y-6">
      {/* Header - Using PageHeader component */}
      <PageHeader
        title="Edit Form"
        description="Configure your form settings"
        actions={[
          {
            label: "Cancel",
            href: `/dashboard/forms/${formId}`,
            isPrimary: false
          },
          {
            label: saving ? "Saving..." : "Save Changes",
            onClick: handleSubmit,
            isPrimary: true,
            isLoading: saving,
            disabled: saving,
            icon: !saving ? saveIcon : undefined
          }
        ]}
      />

      {/* Success message */}
      {saveSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-hubspot p-4 mb-6">
          <div className="flex">
            <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">
                Form settings saved successfully!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Form settings */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card-hubspot">
          <h2 className="text-lg font-medium text-hubspot-blue-dark mb-6">Form Settings</h2>
          
          {/* Form Name */}
          <div className="mb-6">
            <label htmlFor="formName" className="block text-sm font-medium text-hubspot-gray-700 mb-1">
              Form Name
            </label>
            <input
              type="text"
              id="formName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-hubspot-gray-300 rounded-hubspot text-hubspot-gray-700 focus:outline-none focus:ring-2 focus:ring-hubspot-orange focus:border-transparent"
              placeholder="Enter form name"
              required
            />
            <p className="mt-1 text-xs text-hubspot-gray-500">
              This name is only visible to you in your dashboard.
            </p>
          </div>
          
          {/* Toggle for Form Activation */}
          <div className="flex py-4 border-b border-hubspot-gray-200">
            <Toggle
              id="formStatus"
              checked={active}
              onChange={setActive}
              label="Form Status"
              description={`This form is currently ${active ? 'active' : 'inactive'} and ${active ? 'accepting' : 'not accepting'} submissions.`}
            />
          </div>
          
          {/* Toggle for Spam Protection */}
          <div className="py-4 border-t border-hubspot-gray-200">
            <Toggle
              id="spamProtection"
              checked={spamProtection}
              onChange={setSpamProtection}
              label="Spam Protection"
              description="Automatically filter out spam submissions with our AI-powered protection."
            />
          </div>
          
          {/* Email Notification Settings */}
          <div className="py-4 border-t border-hubspot-gray-200">
            <div className="mb-4">
              <Toggle
                id="emailNotifications"
                checked={emailNotifications}
                onChange={setEmailNotifications}
                label="Email Notifications"
                description="Get notified by email when you receive a new submission."
              />
            </div>
            
            {emailNotifications && (
              <div className="mt-2">
                <label htmlFor="notificationEmail" className="block text-sm font-medium text-hubspot-gray-700 mb-1">
                  Send Notifications To
                </label>
                <input
                  type="email"
                  id="notificationEmail"
                  value={notificationEmail}
                  onChange={(e) => setNotificationEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-hubspot-gray-300 rounded-hubspot text-hubspot-gray-700 focus:outline-none focus:ring-2 focus:ring-hubspot-orange focus:border-transparent"
                  placeholder="your@email.com"
                  required={emailNotifications}
                />
                <p className="mt-1 text-xs text-hubspot-gray-500">
                  You'll receive an email notification at this address for each new submission.
                </p>
              </div>
            )}
          </div>
          
          {/* Data Retention Dropdown */}
          <div className="py-4 border-t border-hubspot-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-hubspot-blue-dark">Data Retention</h3>
                <p className="text-xs text-hubspot-gray-500 mt-1">
                  Choose how long submission data should be kept before automatic deletion.
                </p>
              </div>
              <select
                id="dataRetention"
                value={dataRetention}
                onChange={(e) => setDataRetention(e.target.value)}
                className="px-3 py-2 border border-hubspot-gray-300 rounded-hubspot text-hubspot-gray-700 focus:outline-none focus:ring-2 focus:ring-hubspot-orange focus:border-transparent"
              >
                <option value="forever">Forever</option>
                <option value="30days">30 days</option>
                <option value="90days">90 days</option>
                <option value="1year">1 year</option>
                <option value="3years">3 years</option>
              </select>
            </div>
            <p className="mt-3 text-xs text-hubspot-gray-500">
              Current setting: Submissions will be kept <span className="font-medium">{getDataRetentionText(dataRetention)}</span>
            </p>
          </div>
        </div>
        
        {/* Danger Zone */}
        <div className="card-hubspot bg-red-50 border-red-100">
          <h2 className="text-lg font-medium text-red-700 mb-4">Danger Zone</h2>
          <p className="text-sm text-red-600 mb-4">
            Deleting a form is permanent and will also delete all of its submissions. This action cannot be undone.
          </p>
          <button 
            type="button"
            onClick={() => setDeleteConfirmOpen(true)}
            className="btn-danger text-sm"
          >
            Delete Form
          </button>
        </div>
      </form>
      
      {/* Delete Confirmation Modal */}
      {deleteConfirmOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-hubspot-lg shadow-hubspot-lg max-w-md w-full mx-auto">
            <div className="px-6 py-4 border-b border-hubspot-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-red-600">Delete Form</h3>
              <button 
                onClick={() => setDeleteConfirmOpen(false)}
                className="text-hubspot-gray-500 hover:text-hubspot-gray-700"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <div className="rounded-hubspot bg-red-50 p-4 mb-4">
                <div className="flex">
                  <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      You are about to delete "{name}"
                    </h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>
                        This will permanently delete the form and all its submissions. This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="text-hubspot-orange focus:ring-hubspot-orange h-4 w-4 border-hubspot-gray-300 rounded"
                    checked={deleteChecked}
                    onChange={(e) => setDeleteChecked(e.target.checked)}
                  />
                  <span className="ml-2 text-sm text-hubspot-gray-700">
                    I understand that this action is permanent and cannot be undone
                  </span>
                </label>
              </div>
              
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setDeleteConfirmOpen(false)}
                  className="btn-hubspot-secondary text-sm"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteForm}
                  disabled={!deleteChecked}
                  className={`px-4 py-2 rounded-hubspot text-white text-sm font-medium ${deleteChecked ? 'bg-red-600 hover:bg-red-700' : 'bg-red-300 cursor-not-allowed'}`}
                >
                  Delete Form
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 