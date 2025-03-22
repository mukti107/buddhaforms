"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

// Mock user for UI development
const user = {
  name: "Jane Smith",
  email: "jane@example.com",
  picture: "https://randomuser.me/api/portraits/women/60.jpg",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCreateFormModalOpen, setIsCreateFormModalOpen] = useState(false);
  const [formName, setFormName] = useState('');
  const [emailTo, setEmailTo] = useState('');
  const [shouldShowSidebar, setShouldShowSidebar] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  // Check if we should be showing the sidebar based on whether forms exist
  useEffect(() => {
    // Check if we should show empty state for demo purposes
    const shouldShowEmptyState = localStorage.getItem('showEmptyState');
    const hasSeenWelcome = shouldShowEmptyState === 'false';
    
    // Only show sidebar if we have forms
    setShouldShowSidebar(hasSeenWelcome);
  }, []);

  // Listen for the formCreated event to show sidebar after form creation
  useEffect(() => {
    const handleFormCreated = () => {
      setShouldShowSidebar(true);
    };
    
    document.addEventListener('formCreated', handleFormCreated);
    
    return () => {
      document.removeEventListener('formCreated', handleFormCreated);
    };
  }, []);

  // Listen for the custom event from dashboard page
  useEffect(() => {
    const handleOpenFormModal = () => {
      setIsCreateFormModalOpen(true);
    };
    
    document.addEventListener('openCreateFormModal', handleOpenFormModal);
    
    return () => {
      document.removeEventListener('openCreateFormModal', handleOpenFormModal);
    };
  }, []);

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

  const isActive = (path: string) => {
    if (path === "/dashboard" && pathname === "/dashboard") {
      return true;
    }
    if (path !== "/dashboard" && pathname.startsWith(path)) {
      return true;
    }
    return false;
  };

  const handleCreateForm = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formName.trim() || !emailTo.trim()) {
      alert('Please fill out all fields');
      return;
    }
    
    // In a real app, you would call an API to create the form
    console.log('Creating form:', { name: formName, emailTo });
    
    // Reset form and close modal
    setFormName('');
    setEmailTo('');
    setIsCreateFormModalOpen(false);
    
    // Set form creation state in localStorage so the dashboard knows we have forms
    localStorage.setItem('showEmptyState', 'false');
    
    // Dispatch an event for the dashboard to listen for
    document.dispatchEvent(new CustomEvent('formCreated'));
    
    // In a real app, you would refresh the forms list or navigate to the forms page
    if (pathname !== "/dashboard/forms") {
      router.push('/dashboard/forms');
    }
    
    // Show success message
    alert(`Form "${formName}" created successfully!`);
  };

  const handleLogout = () => {
    // In a real app, this would clear authentication tokens, call logout API, etc.
    // For now, just simulate logout by redirecting to home page
    localStorage.removeItem('showEmptyState'); // Reset welcome screen state
    
    // Show confirmation before logout
    if (confirm('Are you sure you want to log out?')) {
      router.push('/');
    }
  };

  return (
    <div className="flex h-screen bg-buddha-gray-50">
      {/* Sidebar backdrop for mobile */}
      {shouldShowSidebar && sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-buddha-blue-dark/30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar - only show when shouldShowSidebar is true */}
      {shouldShowSidebar && (
        <div
          id="sidebar"
          className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-white shadow-buddha-md transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Logo and branding */}
          <div className="flex h-16 items-center justify-center border-b border-buddha-gray-200">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-buddha-orange flex items-center justify-center">
                <span className="text-white font-bold">BF</span>
              </div>
              <span className="text-lg font-semibold text-buddha-blue-dark">BuddhaForms</span>
            </Link>
          </div>

          {/* User info */}
          <div className="border-b border-buddha-gray-200 p-4">
            <div className="flex items-center gap-3 mb-2">
              <img
                src={user.picture}
                alt={user.name}
                className="h-9 w-9 rounded-full border-2 border-buddha-gray-100"
              />
              <div className="flex flex-col overflow-hidden">
                <span className="font-medium text-sm text-buddha-blue-dark truncate">{user.name}</span>
                <span className="text-xs text-buddha-gray-500 truncate">{user.email}</span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-1">
            <Link
              href="/dashboard"
              className={`sidebar-link text-sm ${isActive("/dashboard") ? "active" : ""}`}
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
              href="/dashboard/forms"
              className={`sidebar-link text-sm ${isActive("/dashboard/forms") ? "active" : ""}`}
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
              href="/dashboard/submissions"
              className={`sidebar-link text-sm ${isActive("/dashboard/submissions") ? "active" : ""}`}
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

            <Link
              href="/dashboard/settings"
              className={`sidebar-link text-sm ${isActive("/dashboard/settings") ? "active" : ""}`}
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
            </Link>
            
            <div className="pt-3 mt-3 border-t border-buddha-gray-200">
              <a href="https://docs.buddhaforms.com" target="_blank" rel="noopener noreferrer" className="sidebar-link text-sm">
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
        <header className="bg-white border-b border-buddha-gray-200 h-16 flex items-center justify-between px-4 lg:px-6">
          {shouldShowSidebar ? (
            /* Show sidebar toggle when sidebar is present */
            <button
              id="sidebar-toggle"
              className="text-buddha-gray-700 lg:hidden"
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
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-buddha-orange flex items-center justify-center">
                <span className="text-white font-bold">BF</span>
              </div>
              <span className="text-lg font-semibold text-buddha-blue-dark">BuddhaForms</span>
            </Link>
          )}

          <div className="flex items-center gap-3 ml-auto">
            <button 
              onClick={() => setIsCreateFormModalOpen(true)}
              className="btn-buddha flex items-center gap-1 text-sm"
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
          <div className="bg-white rounded-buddha-lg shadow-buddha-lg max-w-md w-full mx-auto">
            <div className="px-6 py-4 border-b border-buddha-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-buddha-blue-dark">Create New Form</h3>
              <button 
                onClick={() => setIsCreateFormModalOpen(false)}
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
                  onClick={() => setIsCreateFormModalOpen(false)}
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