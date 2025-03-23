"use client";

import Link from 'next/link';
import useSWR from 'swr';
import WelcomeScreen from '../components/WelcomeScreen';
import FormsAnalytics from '../components/FormsAnalytics';
import SubmissionLimitInfo from '../components/SubmissionLimitInfo';
import { APP_BASE_URL } from '../constants';
import { getSubmissionUrl } from '../helper';

interface Form {
  formId: string;
  name: string;
  active: boolean;
  createdAt: string;
  settings?: {
    notificationEmail: string;
    emailNotifications: boolean;
  };
}

interface Submission {
  id: string;
  formId: string;
  data: Record<string, any>;
  submittedAt: string;
  form?: {
    name: string;
  };
}

// Fetcher function for SWR
const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function Dashboard() {
  // Fetch forms data
  const { data: formsData, error: formsError, isLoading: formsLoading } = useSWR('/api/forms', fetcher);
  
  // Fetch recent submissions
  const { data: submissionsData, error: submissionsError, isLoading: submissionsLoading } = useSWR(
    '/api/submissions?limit=3',
    fetcher
  );

  const forms = formsData?.forms || [];
  const recentSubmissions = submissionsData?.submissions || [];

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

  // Show loading state
  if (formsLoading || submissionsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse">
          <svg className="h-10 w-10 text-parrot-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        </div>
      </div>
    );
  }

  // Show error state
  if (formsError || submissionsError) {
    return (
      <div className="card-parrot text-center p-8">
        <p className="text-red-600">Failed to load dashboard data</p>
      </div>
    );
  }

  // If there are no forms, show welcome screen
  if (forms.length === 0) {
    return <WelcomeScreen onGetStarted={() => {
      // Open the create form modal directly
      document.dispatchEvent(new CustomEvent('openCreateFormModal'));
    }} />;
  }

  // Calculate dashboard stats
  const formCount = forms.length;
  const activeFormCount = forms.filter((form: Form) => form.active).length;
  const submissionCount = submissionsData?.pagination?.total || 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-parrot-blue-dark">Dashboard</h1>
      </div>
      
      {/* Analytics Section */}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-[70%]">
          <FormsAnalytics />
        </div>
        <div className="w-full md:w-[30%]">
          <SubmissionLimitInfo used={submissionCount} total={1000} planName="Pro Plan" />
        </div>
      </div>
      
      {/* Recent Activity & Forms Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Submissions */}
        <div className="card-parrot">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-parrot-blue-dark">Recent Submissions</h2>
            <Link href="/submissions" className="text-parrot-green hover:text-parrot-green-dark text-sm font-medium">
              View All
            </Link>
          </div>
          
          {recentSubmissions.length === 0 ? (
            <div className="text-center py-8 border border-dashed border-parrot-gray-300 rounded-parrot bg-parrot-gray-50">
              <svg className="h-12 w-12 text-parrot-gray-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p className="text-parrot-gray-600">No submissions yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentSubmissions.map((submission: Submission) => (
                <Link 
                  key={submission.id}
                  href={`/submissions/${submission.id}`}
                  className="flex items-center justify-between p-3 rounded-parrot border border-parrot-gray-200 hover:border-parrot-gray-300 bg-white"
                >
                  <div>
                    <div className="font-medium text-parrot-blue-dark">{submission.form?.name}</div>
                    <div className="text-sm text-parrot-gray-600">{formatDate(submission.submittedAt)}</div>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-parrot-green-light text-parrot-green-dark">
                    New
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
        
        {/* Your Forms */}
        <div className="card-parrot">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-parrot-blue-dark">Your Forms</h2>
            <Link href="/forms" className="text-parrot-green hover:text-parrot-green-dark text-sm font-medium">
              View All
            </Link>
          </div>
          
          <div className="space-y-3">
            {forms.map((form: Form) => (
              <Link 
                key={form.formId} 
                href={`/forms/${form.formId}`}
                className="flex items-center justify-between p-3 rounded-parrot border border-parrot-gray-200 hover:border-parrot-orange transition-colors duration-200"
              >
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-parrot bg-parrot-gray-100 text-parrot-green flex items-center justify-center mr-3">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium text-parrot-blue-dark">{form.name}</div>
                    <div className="text-sm text-parrot-gray-600">
                      {form.settings?.notificationEmail || 'No notification email set'}
                    </div>
                  </div>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  form.active 
                    ? 'bg-parrot-green-light text-parrot-green-dark' 
                    : 'bg-parrot-gray-200 text-parrot-gray-700'
                }`}>
                  {form.active ? 'Active' : 'Inactive'}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
      
      {/* Integration Guide */}
      <div className="card-parrot">
        <h2 className="text-lg font-medium text-parrot-blue-dark mb-4">Quick Integration Guide</h2>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 space-y-4">
            <p className="text-parrot-gray-700">
              Easily collect form submissions from your website by using your unique form endpoint.
            </p>
            <div className="bg-parrot-gray-50 p-4 rounded-parrot border border-parrot-gray-200">
              <div className="text-sm font-mono text-parrot-gray-800">
                <code>{getSubmissionUrl("YOUR_FORM_ID")}</code>
              </div>
            </div>
          </div>
          <div className="flex-1 space-y-4">
            <h3 className="font-medium text-parrot-blue-dark">Need help?</h3>
            <div className="space-y-2">
              <a href="https://docs.parrotforms.com" target="_blank" rel="noopener noreferrer" className="text-parrot-green hover:text-parrot-green-dark flex items-center gap-1">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Documentation</span>
              </a>
              <a href="mailto:support@parrotforms.com" className="text-parrot-green hover:text-parrot-green-dark flex items-center gap-1">
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