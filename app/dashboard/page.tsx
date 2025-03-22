"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import WelcomeScreen from '../components/WelcomeScreen';
import { Form, FormSubmission, mockForms, getRecentSubmissions, mockSubmissions, getSubmissionsByForm } from '../lib/mockData';
import FormsAnalytics from '../components/FormsAnalytics';
import SubmissionLimitInfo from '../components/SubmissionLimitInfo';

export default function Dashboard() {
  // Properly type the forms state
  const [forms, setForms] = useState<Form[]>([]);
  // Add a loading state to prevent welcome screen flash
  const [isLoading, setIsLoading] = useState(true);
  
  // Load forms data (mock for now)
  useEffect(() => {
    // In a real app, this would be an API call
    // For now, we'll use mock data from mockData.ts
    
    // Check if we should show empty state for demo purposes
    // If showEmptyState is not set or is 'true', show the welcome screen
    // If it's explicitly set to 'false', show the dashboard with forms
    const shouldShowEmptyState = localStorage.getItem('showEmptyState');
    const hasSeenWelcome = shouldShowEmptyState === 'false';
    
    // Set forms data - empty array if we want to show empty state
    setForms(hasSeenWelcome ? mockForms : []);
    // Set loading to false after we've determined the initial state
    setIsLoading(false);
  }, []);
  
  // Handle form creation from the modal
  useEffect(() => {
    // Function to handle the event when a form is created
    const handleFormCreated = () => {
      // If we had an empty state, now show at least one form
      if (forms.length === 0) {
        // Set localStorage to remember we don't want empty state anymore
        localStorage.setItem('showEmptyState', 'false');
        
        const newForm: Form = { 
          id: 'form1', 
          name: 'New Form', 
          submissionCount: 0, 
          active: true 
        };
        setForms([newForm]);
      }
    };
    
    // Listen for a custom event that our form creation modal might dispatch
    document.addEventListener('formCreated', handleFormCreated);
    
    return () => {
      document.removeEventListener('formCreated', handleFormCreated);
    };
  }, [forms]);

  // Mock data for UI development derived from forms state
  const formCount = forms.length;
  const submissionCount = forms.reduce((total, form) => total + (form.submissionCount || 0), 0);
  const activeFormCount = forms.filter(form => form.active).length;
  
  // Calculate submissions for current month (for demo purposes)
  const currentMonth = new Date().getMonth();
  // Use the actual count from mockSubmissions instead of the sum from form.submissionCount
  const totalSubmissionCount = forms.length === 0 ? 0 : mockSubmissions.length;
  const currentMonthSubmissions = Math.floor(totalSubmissionCount * 0.4); // Just a mock calculation for demo
  
  // Get recent submissions from mock data - only show 3
  const recentSubmissions = forms.length === 0 ? [] : getRecentSubmissions(3);

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

  // Show a loading state to prevent welcome screen flash
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse">
          <svg className="h-10 w-10 text-buddha-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        </div>
      </div>
    );
  }

  // If there are no forms, show welcome screen
  if (forms.length === 0) {
    return <WelcomeScreen onGetStarted={() => {
      // This function handles the "Get Started" button click
      // Open the create form modal directly
      document.dispatchEvent(new CustomEvent('openCreateFormModal'));
    }} />;
  }

  // Otherwise show regular dashboard
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-buddha-blue-dark">Dashboard</h1>
      </div>
      
      {/* Analytics Section */}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-[70%]">
          <FormsAnalytics />
        </div>
        <div className="w-full md:w-[30%]">
          <SubmissionLimitInfo used={450} total={1000} planName="Pro Plan" />
        </div>
      </div>
      
      {/* Recent Activity & Forms Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Submissions */}
        <div className="card-buddha">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-buddha-blue-dark">Recent Submissions</h2>
            <Link href="/dashboard/submissions" className="text-buddha-orange hover:text-buddha-orange-dark text-sm font-medium">
              View All
            </Link>
          </div>
          
          {recentSubmissions.length === 0 ? (
            <div className="text-center py-8 border border-dashed border-buddha-gray-300 rounded-buddha bg-buddha-gray-50">
              <svg className="h-12 w-12 text-buddha-gray-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p className="text-buddha-gray-600">No submissions yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentSubmissions.map((submission) => (
                <div 
                  key={submission.id} 
                  className="flex items-center justify-between p-3 rounded-buddha border border-buddha-gray-200 hover:border-buddha-gray-300 bg-white"
                >
                  <div>
                    <div className="font-medium text-buddha-blue-dark">{submission.formName}</div>
                    <div className="text-sm text-buddha-gray-600">{formatDate(submission.submittedAt)}</div>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-buddha-green-light text-buddha-green-dark">
                    New
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Your Forms */}
        <div className="card-buddha">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-buddha-blue-dark">Your Forms</h2>
            <Link href="/dashboard/forms" className="text-buddha-orange hover:text-buddha-orange-dark text-sm font-medium">
              View All
            </Link>
          </div>
          
          {forms.length === 0 ? (
            <div className="text-center py-8 border border-dashed border-buddha-gray-300 rounded-buddha bg-buddha-gray-50">
              <svg className="h-12 w-12 text-buddha-gray-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-buddha-gray-600">No forms created yet</p>
              <button 
                onClick={() => {
                  // Use document.dispatchEvent to communicate with layout
                  document.dispatchEvent(new CustomEvent('openCreateFormModal'));
                }}
                className="btn-buddha inline-block mt-4"
              >
                Create Your First Form
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {forms.map((form) => (
                <Link 
                  key={form.id} 
                  href={`/dashboard/forms/${form.id}`}
                  className="flex items-center justify-between p-3 rounded-buddha border border-buddha-gray-200 hover:border-buddha-orange transition-colors duration-200"
                >
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-buddha bg-buddha-gray-100 text-buddha-orange flex items-center justify-center mr-3">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium text-buddha-blue-dark">{form.name}</div>
                      <div className="text-sm text-buddha-gray-600">{getSubmissionsByForm(form.id).length} submissions</div>
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    form.active 
                      ? 'bg-buddha-green-light text-buddha-green-dark' 
                      : 'bg-buddha-gray-200 text-buddha-gray-700'
                  }`}>
                    {form.active ? 'Active' : 'Inactive'}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
      
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
    </div>
  );
} 