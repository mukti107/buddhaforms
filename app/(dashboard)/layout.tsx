"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import useSWR, { mutate } from 'swr';
import { useUser } from '@auth0/nextjs-auth0/client';

interface CreateFormData {
  name: string;
  settings: {
    notificationEmail: string;
  };
}

// Fetcher function for SWR
const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, error: userError, isLoading: userLoading } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  // Fetch forms to determine if user has any
  const { data: formsData, error: formsError } = useSWR('/api/forms', fetcher);
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCreateFormModalOpen, setIsCreateFormModalOpen] = useState(false);
  const [formName, setFormName] = useState('');
  const [emailTo, setEmailTo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Determine if sidebar should be shown based on forms data
  const shouldShowSidebar = Boolean(formsData?.forms?.length);

  // Redirect if not authenticated
  useEffect(() => {
    if (!userLoading && !user) {
      // Redirect to Auth0 login
      window.location.href = '/api/auth/login';
    }
  }, [user, userLoading]);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const sidebar = document.getElementById("sidebar");
      const toggleButton = document.getElementById("sidebar-toggle");
      
      if (
        sidebar &&
        toggleButton &&
        !sidebar.contains(event.target as Node) &&
        !toggleButton.contains(event.target as Node) &&
        sidebarOpen
      ) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [sidebarOpen]);

  // Close sidebar when route changes on mobile
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  // Add event listener for opening create form modal
  useEffect(() => {
    const handleOpenCreateFormModal = () => {
      setIsCreateFormModalOpen(true);
    };

    document.addEventListener('openCreateFormModal', handleOpenCreateFormModal);
    return () => {
      document.removeEventListener('openCreateFormModal', handleOpenCreateFormModal);
    };
  }, []);

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") {
      return true;
    }
    if (path !== "/" && pathname.startsWith(path)) {
      return true;
    }
    return false;
  };

  const handleCreateForm = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formName.trim() || !emailTo.trim()) {
      alert('Please fill out all fields');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/forms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          name: formName, 
          settings: {
            notificationEmail: emailTo
          }
        } as CreateFormData),
      });

      if (!response.ok) {
        throw new Error('Failed to create form');
      }

      const data = await response.json();
      
      // Reset form and close modal
      setFormName('');
      setEmailTo('');
      setIsCreateFormModalOpen(false);
      
      // Revalidate forms data
      mutate('/api/forms');
      
      // Navigate to forms page if not already there
      if (pathname !== "//forms") {
        router.push('//forms');
      }
      
      // Show success message
      alert(`Form "${formName}" created successfully!`);
    } catch (err) {
      console.error(err);
      alert('Failed to create form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to log out?')) {
      router.push('/api/auth/logout');
    }
  };

  return (
    <div className="flex h-screen bg-parrot-gray-50">
      {/* Sidebar backdrop for mobile */}
      {shouldShowSidebar && sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-parrot-blue-dark/30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar - only show when user has forms */}
      {shouldShowSidebar && (
        <div
          id="sidebar"
          className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-white shadow-parrot-md transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Logo and branding */}
          <div className="flex h-16 items-center justify-center border-b border-parrot-gray-200">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-parrot-green flex items-center justify-center">
                <span className="text-white font-bold">PF</span>
              </div>
              <span className="text-lg font-semibold text-parrot-blue-dark">ParrotForms</span>
            </Link>
          </div>

          {/* User info */}
          <div className="border-b border-parrot-gray-200 p-4">
            <div className="flex items-center gap-3 mb-2">
              <img
                src={user?.picture || "https://via.placeholder.com/40"}
                alt={user?.name || "User"}
                className="h-9 w-9 rounded-full border-2 border-parrot-gray-100"
              />
              <div className="flex flex-col overflow-hidden">
                <span className="font-medium text-sm text-parrot-blue-dark truncate">
                  {user?.name}
                </span>
                <span className="text-xs text-parrot-gray-500 truncate">
                  {user?.email}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-1">
            <Link
              href="/"
              className={`sidebar-link text-sm ${isActive("/") ? "active" : ""}`}
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

            {/* Always show Forms and Submissions links, they will be empty if no forms exist */}
            <Link
              href="/forms"
              className={`sidebar-link text-sm ${isActive("//forms") ? "active" : ""}`}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span>My Forms</span>
            </Link>

            <Link
              href="/submissions"
              className={`sidebar-link text-sm ${isActive("//submissions") ? "active" : ""}`}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <span>Submissions</span>
            </Link>

            {/* <Link
              href="/settings"
              className={`sidebar-link text-sm ${isActive("//settings") ? "active" : ""}`}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span>Settings</span>
            </Link> */}
            
            <div className="pt-3 mt-3 border-t border-parrot-gray-200">
              <a href="https://docs.parrotforms.com" target="_blank" rel="noopener noreferrer" className="sidebar-link text-sm">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
                <span>Documentation</span>
              </a>
              
              <button 
                onClick={handleLogout}
                className="sidebar-link text-sm w-full mt-2 text-left"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                <span>Log Out</span>
              </button>
            </div>
          </nav>
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header - always show, but with modified styling based on sidebar visibility */}
        <header className="bg-white border-b border-parrot-gray-200 h-16 flex items-center justify-between px-4 lg:px-6">
          {shouldShowSidebar ? (
            /* Show sidebar toggle when sidebar is present */
            <button
              id="sidebar-toggle"
              className="text-parrot-gray-700 lg:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          ) : (
            /* Show logo when sidebar is hidden */
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-parrot-green flex items-center justify-center">
                <span className="text-white font-bold">BF</span>
              </div>
              <span className="text-lg font-semibold text-parrot-blue-dark">ParrotForms</span>
            </Link>
          )}

          <div className="flex items-center gap-3 ml-auto">
            <button 
              onClick={() => setIsCreateFormModalOpen(true)}
              className="btn-parrot flex items-center gap-1 text-sm"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span>New Form</span>
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className={`flex-1 overflow-auto ${shouldShowSidebar ? 'p-4 lg:p-6' : ''}`}>
          {children}
        </main>
      </div>

      {/* Create Form Modal */}
      {isCreateFormModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-parrot-lg shadow-parrot-lg max-w-md w-full mx-auto">
            <div className="px-6 py-4 border-b border-parrot-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-parrot-blue-dark">Create New Form</h3>
              <button 
                onClick={() => setIsCreateFormModalOpen(false)}
                className="text-parrot-gray-500 hover:text-parrot-gray-700"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleCreateForm} className="p-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="formName" className="block text-sm font-medium text-parrot-gray-700 mb-1">
                    Form Name
                  </label>
                  <input
                    type="text"
                    id="formName"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full px-3 py-2 border border-parrot-gray-300 rounded-parrot text-parrot-gray-700 focus:outline-none focus:ring-2 focus:ring-parrot-orange focus:border-transparent"
                    placeholder="Contact Form"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="emailTo" className="block text-sm font-medium text-parrot-gray-700 mb-1">
                    Send Notifications To
                  </label>
                  <input
                    type="email"
                    id="emailTo"
                    value={emailTo}
                    onChange={(e) => setEmailTo(e.target.value)}
                    className="w-full px-3 py-2 border border-parrot-gray-300 rounded-parrot text-parrot-gray-700 focus:outline-none focus:ring-2 focus:ring-parrot-orange focus:border-transparent"
                    placeholder="email@example.com"
                    required
                  />
                  <p className="mt-1 text-xs text-parrot-gray-500">
                    Form submissions will be sent to this email address.
                  </p>
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateFormModalOpen(false)}
                  className="btn-parrot-secondary text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`btn-parrot text-sm ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? 'Creating...' : 'Create Form'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 