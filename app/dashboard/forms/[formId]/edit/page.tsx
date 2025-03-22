"use client";

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react';
import useSWR, { mutate } from 'swr';
import PageHeader from '@/app/components/PageHeader';
import { Toggle } from '@/app/components/ui/toggle';

interface Form {
  formId: string;
  name: string;
  active: boolean;
  settings?: {
    emailNotifications: boolean;
    notificationEmail: string;
    honeypot: boolean;
    dataRetention?: string;
  };
}

// Fetcher function for SWR
const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function EditFormPage() {
  const router = useRouter();
  const params = useParams();
  const { formId } = params;

  // Fetch form data
  const { data, error, isLoading } = useSWR<{ form: Form }>(`/api/forms/${formId}`, fetcher);
  const form = data?.form;

  // State for form fields
  const [name, setName] = useState(form?.name || '');
  const [active, setActive] = useState(form?.active || false);
  const [spamProtection, setSpamProtection] = useState(form?.settings?.honeypot || false);
  const [dataRetention, setDataRetention] = useState(form?.settings?.dataRetention || 'forever');
  const [emailNotifications, setEmailNotifications] = useState(form?.settings?.emailNotifications !== undefined ? form?.settings.emailNotifications : true);
  const [notificationEmail, setNotificationEmail] = useState(form?.settings?.notificationEmail || '');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteChecked, setDeleteChecked] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Update state when form data is loaded
  React.useEffect(() => {
    if (form) {
      setName(form.name);
      setActive(form.active);
      setSpamProtection(form.settings?.honeypot || false);
      setDataRetention(form.settings?.dataRetention || 'forever');
      setEmailNotifications(form.settings?.emailNotifications !== undefined ? form.settings.emailNotifications : true);
      setNotificationEmail(form.settings?.notificationEmail || '');
    }
  }, [form]);

  if (isLoading) {
    return (
      <div className="card-buddha text-center p-8">
        <p className="text-buddha-gray-600">Loading form details...</p>
      </div>
    );
  }

  if (error || !form) {
    return (
      <div className="card-buddha text-center p-8">
        <h1 className="text-xl font-semibold text-buddha-blue-dark mb-4">Form Not Found</h1>
        <p className="mb-6 text-buddha-gray-600 text-sm">The form you're looking for doesn't exist or has been deleted.</p>
        <Link href="/dashboard/forms" className="btn-buddha text-sm">
          Return to Forms
        </Link>
      </div>
    );
  }

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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);

    try {
      const response = await fetch(`/api/forms/${formId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          active,
          settings: {
            honeypot: spamProtection,
            dataRetention,
            emailNotifications,
            notificationEmail: emailNotifications ? notificationEmail : null,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update form');
      }

      // Revalidate form data
      mutate(`/api/forms/${formId}`);
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      alert('Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteForm = async () => {
    if (!deleteChecked) return;

    try {
      const response = await fetch(`/api/forms/${formId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete form');
      }

      // Revalidate forms list and redirect
      mutate('/api/forms');
      router.push('/dashboard/forms');
    } catch (err) {
      console.error(err);
      alert('Failed to delete form. Please try again.');
    }
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
            onClick: handleSave,
            isPrimary: true,
            isLoading: saving,
            disabled: saving,
            icon: !saving ? saveIcon : undefined
          }
        ]}
      />

      {/* Success message */}
      {saveSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-buddha p-4 mb-6">
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
      <form onSubmit={handleSave} className="space-y-6">
        <div className="card-buddha">
          <h2 className="text-lg font-medium text-buddha-blue-dark mb-6">Form Settings</h2>
          
          {/* Form Name */}
          <div className="mb-6">
            <label htmlFor="formName" className="block text-sm font-medium text-buddha-gray-700 mb-1">
              Form Name
            </label>
            <input
              type="text"
              id="formName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-buddha-gray-300 rounded-buddha text-buddha-gray-700 focus:outline-none focus:ring-2 focus:ring-buddha-orange focus:border-transparent"
              placeholder="Enter form name"
              required
            />
            <p className="mt-1 text-xs text-buddha-gray-500">
              This name is only visible to you in your dashboard.
            </p>
          </div>
          
          {/* Toggle for Form Activation */}
          <div className="py-4">
            <Toggle
              id="formStatus"
              checked={active}
              onChange={setActive}
              label="Form Status"
              description={`This form is currently ${active ? 'active' : 'inactive'} and ${active ? 'accepting' : 'not accepting'} submissions.`}
            />
          </div>
          
          {/* Toggle for Spam Protection */}
          <div className="py-4">
            <Toggle
              id="spamProtection"
              checked={spamProtection}
              onChange={setSpamProtection}
              label="Spam Protection"
              description="Automatically filter out spam submissions with our AI-powered protection."
            />
          </div>
          
          {/* Email Notification Settings */}
          <div className="py-4">
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
                <label htmlFor="notificationEmail" className="block text-sm font-medium text-buddha-gray-700 mb-1">
                  Send Notifications To
                </label>
                <input
                  type="email"
                  id="notificationEmail"
                  value={notificationEmail}
                  onChange={(e) => setNotificationEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-buddha-gray-300 rounded-buddha text-buddha-gray-700 focus:outline-none focus:ring-2 focus:ring-buddha-orange focus:border-transparent"
                  placeholder="your@email.com"
                  required={emailNotifications}
                />
                <p className="mt-1 text-xs text-buddha-gray-500">
                  You'll receive an email notification at this address for each new submission.
                </p>
              </div>
            )}
          </div>
          
          {/* Data Retention Dropdown */}
          <div className="py-4">
            <label htmlFor="dataRetention" className="block text-sm font-medium text-buddha-gray-700 mb-1">
              Data Retention
            </label>
            <select
              id="dataRetention"
              value={dataRetention}
              onChange={(e) => setDataRetention(e.target.value)}
              className="w-full px-3 py-2 border border-buddha-gray-300 rounded-buddha text-buddha-gray-700 focus:outline-none focus:ring-2 focus:ring-buddha-orange focus:border-transparent"
            >
              <option value="forever">Forever</option>
              <option value="30days">30 days</option>
              <option value="90days">90 days</option>
              <option value="1year">1 year</option>
              <option value="3years">3 years</option>
            </select>
            <p className="mt-1 text-xs text-buddha-gray-500">
              Choose how long to keep form submissions. After this period, old submissions will be automatically deleted.
            </p>
          </div>
        </div>
        
        {/* Danger Zone */}
        <div className="card-buddha bg-red-50 border-red-100">
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
          <div className="bg-white rounded-buddha-lg shadow-buddha-lg max-w-md w-full mx-auto">
            <div className="px-6 py-4 border-b border-buddha-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-red-600">Delete Form</h3>
              <button 
                onClick={() => setDeleteConfirmOpen(false)}
                className="text-buddha-gray-500 hover:text-buddha-gray-700"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <div className="rounded-buddha bg-red-50 p-4 mb-4">
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
                    className="text-buddha-orange focus:ring-buddha-orange h-4 w-4 border-buddha-gray-300 rounded"
                    checked={deleteChecked}
                    onChange={(e) => setDeleteChecked(e.target.checked)}
                  />
                  <span className="ml-2 text-sm text-buddha-gray-700">
                    I understand that this action is permanent and cannot be undone
                  </span>
                </label>
              </div>
              
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setDeleteConfirmOpen(false)}
                  className="btn-buddha-secondary text-sm"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteForm}
                  disabled={!deleteChecked}
                  className={`px-4 py-2 rounded-buddha text-white text-sm font-medium ${deleteChecked ? 'bg-red-600 hover:bg-red-700' : 'bg-red-300 cursor-not-allowed'}`}
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