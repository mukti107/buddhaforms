'use client';

import React from 'react';

interface WelcomeScreenProps {
  onGetStarted: () => void;
}

export default function WelcomeScreen({ onGetStarted }: WelcomeScreenProps) {
  const handleCreateFormClick = () => {
    // Open the create form modal directly
    document.dispatchEvent(new CustomEvent('openCreateFormModal'));
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="flex flex-col items-center justify-center text-center max-w-3xl mx-auto">
        <div className="h-16 w-16 rounded-full bg-parrot-green flex items-center justify-center mb-6">
          <svg className="h-9 w-9 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        </div>
        
        <h1 className="text-3xl font-bold text-parrot-blue-dark mb-4">Welcome to ParrotForms!</h1>
        
        <p className="text-lg text-parrot-gray-700 mb-8">
          You haven't created any forms yet. Get started by creating your first form.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-10">
          <div className="bg-white p-6 rounded-parrot shadow-parrot">
            <div className="h-12 w-12 rounded-full bg-parrot-green/10 flex items-center justify-center mb-4 mx-auto">
              <svg className="h-6 w-6 text-parrot-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-parrot-blue-dark mb-2">Create a Form</h3>
            <p className="text-parrot-gray-600">
              Design your form with our easy-to-use builder. No coding required.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-parrot shadow-parrot">
            <div className="h-12 w-12 rounded-full bg-parrot-green/10 flex items-center justify-center mb-4 mx-auto">
              <svg className="h-6 w-6 text-parrot-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-parrot-blue-dark mb-2">Embed Your Form</h3>
            <p className="text-parrot-gray-600">
              Add your form to any website with a simple embed code.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-parrot shadow-parrot">
            <div className="h-12 w-12 rounded-full bg-parrot-green/10 flex items-center justify-center mb-4 mx-auto">
              <svg className="h-6 w-6 text-parrot-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-parrot-blue-dark mb-2">Collect Submissions</h3>
            <p className="text-parrot-gray-600">
              Receive form submissions directly to your dashboard and email.
            </p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <button 
            onClick={handleCreateFormClick} 
            className="btn-parrot text-base px-6 py-3"
          >
            Create Your First Form
          </button>
          <a 
            href="https://docs.parrotforms.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn-parrot-secondary text-base px-6 py-3"
          >
            View Documentation
          </a>
        </div>
      </div>
    </div>
  );
} 