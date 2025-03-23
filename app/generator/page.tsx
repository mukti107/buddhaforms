"use client";

import React, { use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Form template options
const formTemplates = [
  {
    id: 'contact-form',
    title: 'Contact form',
    description: 'Create a simple contact form to collect messages from visitors',
    icon: '✉️',
  },
  {
    id: 'feedback-form',
    title: 'Feedback form',
    description: 'Gather feedback about your products or services',
    icon: '📝',
  },
  {
    id: 'survey-form',
    title: 'Survey form',
    description: 'Create surveys with multiple question types',
    icon: '📊',
  },
  {
    id: 'order-form',
    title: 'Order form',
    description: 'Accept orders and collect payment information',
    icon: '🛒',
  },
  {
    id: 'donation-form',
    title: 'Donation form',
    description: 'Collect donations for your cause or organization',
    icon: '💰',
  },
  {
    id: 'booking-form',
    title: 'Booking form',
    description: 'Let visitors book appointments or services',
    icon: '📅',
  },
  {
    id: 'login-form',
    title: 'Login form',
    description: 'Create a login form for your website or application',
    icon: '🔐',
  },
  {
    id: 'quiz-form',
    title: 'Quiz form',
    description: 'Build interactive quizzes and assessments',
    icon: '❓',
  },
  {
    id: 'appointment-form',
    title: 'Appointment booking form',
    description: 'Schedule appointments with availability options',
    icon: '⏰',
  },
  {
    id: 'event-registration-form',
    title: 'Event registration form',
    description: 'Register attendees for your events',
    icon: '🎫',
  },
  {
    id: 'newsletter-signup-form',
    title: 'Newsletter signup form',
    description: 'Grow your email list with a newsletter signup form',
    icon: '📧',
  },
  {
    id: 'registration-form',
    title: 'Registration form',
    description: 'Register users for your service or platform',
    icon: '👤',
  },
  {
    id: 'email-subscription-form',
    title: 'Email subscription form',
    description: 'Simple email signup form for your subscribers',
    icon: '✅',
  },
  {
    id: 'customer-satisfaction-survey',
    title: 'Customer satisfaction survey',
    description: 'Measure customer satisfaction and collect feedback',
    icon: '😊',
  },
  {
    id: 'product-return-form',
    title: 'Product return form',
    description: 'Process product returns and exchanges',
    icon: '↩️',
  },
  {
    id: 'volunteer-signup-form',
    title: 'Volunteer Signup form',
    description: 'Recruit volunteers for your organization',
    icon: '🤝',
  },
];

export default function GeneratorPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-parrot-gray-50 pb-20">
      {/* Header - matching homepage header style */}
      <header className="bg-white border-b border-parrot-gray-200 h-16 flex items-center px-4 lg:px-6">
        <div className="max-w-7xl w-full mx-auto flex justify-between items-center">
          {/* Logo and branding */}
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-parrot-green flex items-center justify-center">
              <span className="text-white font-bold">BF</span>
            </div>
            <span className="text-lg font-semibold text-parrot-blue-dark">ParrotForms</span>
          </Link>
          
          {/* Right side with dashboard button */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-parrot-gray-700 hover:text-parrot-blue transition-colors px-3 py-2 text-sm font-medium"
            >
              Home
            </Link>
            <Link
              href="/dashboard"
              className="btn-parrot flex items-center gap-1 text-sm"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              <span>Dashboard</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Page title section */}
      <div className="bg-gradient-to-r from-parrot-blue to-parrot-blue-dark text-white py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-4xl font-bold mb-4 text-white">Free HTML Form Generator</h1>
          <p className="text-xl text-parrot-blue-light max-w-3xl">
            Choose from a variety of form templates and customize them to fit your needs.
          </p>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="container mx-auto max-w-6xl px-4 -mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {formTemplates.map((template) => (
            <Link 
              key={template.id}
              href={`/generator/${template.id}`}
              className="bg-white rounded-parrot shadow-parrot hover:shadow-parrot-md transition-shadow duration-200 cursor-pointer overflow-hidden border border-parrot-gray-200"
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="text-3xl mr-3">{template.icon}</div>
                  <h3 className="text-lg font-medium text-parrot-blue-dark">{template.title}</h3>
                </div>
                <p className="text-parrot-gray-600 text-sm">{template.description}</p>
                <div className="mt-4 text-parrot-orange hover:text-parrot-orange-dark font-medium text-sm flex items-center">
                  Use this template
                  <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto max-w-6xl px-4 mt-16">
        <div className="bg-white rounded-parrot-lg shadow-parrot p-8 border border-parrot-gray-200">
          <h2 className="text-2xl font-semibold text-parrot-blue-dark mb-6">Why use ParrotForms Generator?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="bg-parrot-green text-white p-3 rounded-parrot inline-block mb-4">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-parrot-blue-dark mb-2">Quick & Easy</h3>
              <p className="text-parrot-gray-600">
                Create beautiful forms in minutes with our intuitive form generator. No coding required.
              </p>
            </div>
            <div>
              <div className="bg-parrot-green text-white p-3 rounded-parrot inline-block mb-4">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-parrot-blue-dark mb-2">100% Free</h3>
              <p className="text-parrot-gray-600">
                Our form generator is completely free to use. No hidden fees or premium features.
              </p>
            </div>
            <div>
              <div className="bg-parrot-green text-white p-3 rounded-parrot inline-block mb-4">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-parrot-blue-dark mb-2">Customizable</h3>
              <p className="text-parrot-gray-600">
                Customize every aspect of your form, from colors to fields to validation rules.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto max-w-6xl px-4 mt-16 text-center">
        <h2 className="text-2xl font-semibold text-parrot-blue-dark mb-4">Ready to create your own form?</h2>
        <p className="text-parrot-gray-600 max-w-2xl mx-auto mb-8">
          Choose a template above to get started or sign up for a free account to save your forms and collect submissions.
        </p>
        <Link href="/dashboard" className="btn-parrot text-base px-8 py-3">
          Create a Free Account
        </Link>
      </div>
    </div>
  );
} 