"use client";

import { useState } from 'react';
import { PageHeader } from '@/app/components/ui/page-header';
import { Toggle } from '@/app/components/ui/toggle';

// Mock user data - in a real app this would come from an API
const mockUser = {
  name: "Jane Smith",
  email: "jane@example.com",
  picture: "https://randomuser.me/api/portraits/women/60.jpg",
  createdAt: new Date('2023-03-15'),
  subscription: {
    plan: "Pro Plan",
    status: "active",
    nextBillingDate: new Date('2023-12-01'),
    price: 29.99,
    features: [
      "Unlimited forms",
      "10,000 monthly submissions",
      "Email notifications",
      "Zapier integration",
      "Custom domains",
      "Priority support"
    ]
  }
};

export default function SettingsPage() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  
  // Format date for display
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const handleExternalAuth = () => {
    // In a real app, this would redirect to Auth0 or similar service
    window.alert("In a production app, this would redirect to Auth0 for password management.");
    // Example redirect: window.location.href = "https://your-tenant.auth0.com/manage-account"
  };

  return (
    <div className="space-y-6">
      <PageHeader
        heading="Settings"
        subheading="Manage your account and subscription"
      />
      
      {/* Profile Section */}
      <div className="card-buddha">
        <h2 className="text-lg font-medium text-buddha-blue-dark mb-6">Profile Information</h2>
        
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-24">
            <div className="h-24 w-24 rounded-full overflow-hidden border-2 border-buddha-gray-200">
              <img src={mockUser.picture} alt={mockUser.name} className="h-full w-full object-cover" />
            </div>
          </div>
          <div className="flex-1 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-buddha-gray-600 mb-1">Name</label>
                <p className="text-buddha-blue-dark font-medium">{mockUser.name}</p>
              </div>
              <div>
                <label className="block text-sm text-buddha-gray-600 mb-1">Email</label>
                <p className="text-buddha-blue-dark font-medium">{mockUser.email}</p>
              </div>
              <div>
                <label className="block text-sm text-buddha-gray-600 mb-1">Member Since</label>
                <p className="text-buddha-blue-dark font-medium">{formatDate(mockUser.createdAt)}</p>
              </div>
            </div>
            
            <div className="flex gap-2 mt-4">
              <button className="btn-buddha">
                Edit Profile
              </button>
              <button 
                className="btn-buddha-secondary"
                onClick={handleExternalAuth}
              >
                Change Password
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Subscription Section */}
      <div className="card-buddha">
        <h2 className="text-lg font-medium text-buddha-blue-dark mb-6">Subscription</h2>
        
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <div className="bg-buddha-blue-50 border border-buddha-blue-200 rounded-buddha p-5">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-xl font-semibold text-buddha-blue-dark">{mockUser.subscription.plan}</h3>
                <span className="px-2.5 py-1 text-sm font-medium rounded-full bg-buddha-orange-light text-buddha-orange-dark">
                  {mockUser.subscription.status}
                </span>
              </div>
              
              <div className="flex items-baseline mb-4">
                <span className="text-2xl font-bold text-buddha-blue-dark">${mockUser.subscription.price}</span>
                <span className="text-buddha-gray-600 ml-1">/month</span>
              </div>
              
              <div className="text-sm text-buddha-gray-700 mb-2">
                Next billing: {formatDate(mockUser.subscription.nextBillingDate)}
              </div>
              
              <button className="btn-buddha-secondary w-full mt-4">
                Manage Subscription
              </button>
            </div>
          </div>
          
          <div className="flex-1">
            <h3 className="text-buddha-blue-dark font-medium mb-3">Plan Features</h3>
            <ul className="space-y-2">
              {mockUser.subscription.features.map((feature, index) => (
                <li key={index} className="flex items-center text-buddha-gray-700">
                  <svg className="h-5 w-5 text-buddha-orange mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
            
            <div className="mt-4">
              <a href="#" className="text-buddha-orange hover:text-buddha-orange-dark text-sm">View all plan options</a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Account Settings Section */}
      <div className="card-buddha">
        <h2 className="text-lg font-medium text-buddha-blue-dark mb-6">Account Settings</h2>
        
        <div className="space-y-4">
          <div className="p-4 border border-buddha-gray-200 rounded-buddha">
            <Toggle
              id="emailNotifications"
              checked={emailNotifications}
              onChange={setEmailNotifications}
              label="Email Notifications"
              description="Receive email notifications for form submissions and account updates"
            />
          </div>
          
          <div className="flex justify-between items-center p-4 border border-buddha-gray-200 rounded-buddha">
            <div>
              <h3 className="font-medium text-buddha-blue-dark">Two-Factor Authentication</h3>
              <p className="text-sm text-buddha-gray-600">Add an extra layer of security to your account</p>
            </div>
            <button className="btn-buddha-secondary">
              Enable
            </button>
          </div>
          
          <div className="flex justify-between items-center p-4 border border-buddha-gray-200 rounded-buddha">
            <div>
              <h3 className="font-medium text-buddha-red-dark">Delete Account</h3>
              <p className="text-sm text-buddha-gray-600">Permanently delete your account and all data</p>
            </div>
            <button className="btn-buddha-danger">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 