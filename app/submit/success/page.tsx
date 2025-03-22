import Link from 'next/link';

export default function SubmissionSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-green-100 p-3">
            <svg
              className="h-12 w-12 text-green-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-800 mb-3">Submission Received!</h1>
        
        <p className="text-gray-600 mb-6">
          Thank you for your submission. We've received your information and will process it shortly.
        </p>
        
        <div className="space-y-4">
          <Link
            href="/"
            className="block w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md transition-colors"
          >
            Return to Homepage
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="block w-full py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-md transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
} 