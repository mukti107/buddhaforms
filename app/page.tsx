import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header - matching dashboard header style */}
      <header className="bg-white border-b border-parrot-gray-200 h-16 flex items-center px-4 lg:px-6">
        <div className="max-w-7xl w-full mx-auto flex justify-between items-center">
          {/* Logo and branding */}
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-parrot-green flex items-center justify-center">
              <span className="text-white font-bold">PF</span>
            </div>
            <span className="text-lg font-semibold text-parrot-blue-dark">ParrotForms</span>
          </Link>
          
          {/* Right side with dashboard button */}
          <div className="flex items-center gap-3">
            <Link
              href="/generator"
              className="text-parrot-gray-700 hover:text-parrot-blue transition-colors px-3 py-2 text-sm font-medium"
            >
              Form Generator
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

      {/* Hero section */}
      <div className="flex-grow bg-gradient-to-br from-parrot-blue to-parrot-blue-dark">
        <main>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="sm:text-center">
              <h1 className="text-4xl font-extrabold text-white sm:text-5xl md:text-6xl">
                <span className="block">Simple form collection</span>
                <span className="block text-parrot-blue-light">for your website</span>
              </h1>
              <p className="mt-3 text-base text-parrot-gray-100 sm:mt-5 sm:text-xl sm:max-w-xl sm:mx-auto">
                ParrotForms helps you create forms, collect submissions, and manage responses - all without coding or complicated setup.
              </p>
              <div className="mt-8 sm:flex sm:justify-center">
                <div className="rounded-parrot shadow-parrot-md">
                  <Link
                    href="/dashboard"
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-parrot text-white bg-parrot-green hover:bg-parrot-green-dark transition-colors md:py-4 md:text-lg md:px-10"
                  >
                    Go to Dashboard
                  </Link>
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3">
                  <a
                    href="#features"
                    className="w-full flex items-center justify-center px-8 py-3 border border-white text-base font-medium rounded-parrot text-white bg-transparent hover:bg-white/10 transition-colors md:py-4 md:text-lg md:px-10"
                  >
                    Learn More
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div id="features" className="py-12 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="lg:text-center">
                <h2 className="text-base text-parrot-orange font-semibold tracking-wide uppercase">Features</h2>
                <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-parrot-blue-dark sm:text-4xl">
                  Everything you need for form management
                </p>
                <p className="mt-4 max-w-2xl text-xl text-parrot-gray-600 lg:mx-auto">
                  ParrotForms provides a complete solution for managing forms and submissions.
                </p>
              </div>

              <div className="mt-10">
                <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-12 w-12 rounded-parrot bg-parrot-green text-white">
                        {/* Icon placeholder */}
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg leading-6 font-medium text-parrot-blue-dark">Easy Form Creation</h3>
                      <p className="mt-2 text-base text-parrot-gray-600">
                        Create forms in seconds with our easy-to-use interface. No coding required.
                      </p>
                    </div>
                  </div>

                  <div className="flex">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-12 w-12 rounded-parrot bg-parrot-green text-white">
                        {/* Icon placeholder */}
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg leading-6 font-medium text-parrot-blue-dark">Email Notifications</h3>
                      <p className="mt-2 text-base text-parrot-gray-600">
                        Receive email notifications for new form submissions so you never miss an important message.
                      </p>
                    </div>
                  </div>

                  <div className="flex">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-12 w-12 rounded-parrot bg-parrot-green text-white">
                        {/* Icon placeholder */}
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg leading-6 font-medium text-parrot-blue-dark">Submission Storage</h3>
                      <p className="mt-2 text-base text-parrot-gray-600">
                        All form submissions are securely stored in your dashboard for easy access and management.
                      </p>
                    </div>
                  </div>

                  <div className="flex">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-12 w-12 rounded-parrot bg-parrot-green text-white">
                        {/* Icon placeholder */}
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg leading-6 font-medium text-parrot-blue-dark">Simple Integration</h3>
                      <p className="mt-2 text-base text-parrot-gray-600">
                        Just copy and paste a single line of code to add your form to any website or landing page.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <footer className="bg-parrot-blue-dark">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="text-white flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-parrot-green flex items-center justify-center">
                <span className="text-white font-bold text-xs">BF</span>
              </div>
              <p className="text-sm">&copy; 2023 ParrotForms. All rights reserved.</p>
            </div>
            <div>
              <Link href="/dashboard" className="text-parrot-gray-100 hover:text-white transition-colors">
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
