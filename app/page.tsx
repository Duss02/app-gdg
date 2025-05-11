'use client';

import ActionsList from './components/ActionsList';
import AccessibilityButton from './components/AccessibilityButton';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Focus on the main title when the page loads
  useEffect(() => {
    if (headingRef.current) {
      headingRef.current.focus();
    }
  }, []);

  // Function to analyze the current page
  const handleAnalyzeCurrentPage = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:8000/analyze-current-page', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      const result = await response.json();
      
      if (result.success && result.data) {
        // Encode the data and update the page to display them
        const encodedData = encodeURIComponent(JSON.stringify(result.data));
        router.push(`/?actions=${encodedData}`);
      } else {
        setError(result.message || 'Error analyzing the current page');
      }
    } catch (err) {
      setError('Connection error to the server. Make sure the server is running.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 text-gray-900" role="main">
      {/* Skip link to go directly to the main content */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-blue-800 focus:border-2 focus:border-blue-800 focus:outline-none focus:rounded"
      >
        Skip to main content
      </a>
      
      <header className="bg-white  mb-6 border-b-2 border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-row items-center">
          {/* Logo on the left */}
          <div>
            <Image 
              src="/logo.jpg" 
              alt="Unveil Logo" 
              width={150} 
              height={50} 
              priority
              className="h-auto"
            />
          </div>
          
          {/* Component for preferences in the header on the right */}
          <div className="ml-auto">
            <AccessibilityButton />
          </div>
        </div>
        
        
      </header>

      <main id="main-content" className="flex-grow p-6 sm:p-8 max-w-7xl mx-auto w-full" tabIndex={-1}>
        {/* Show error if present */}
        {error && (
          <div className="mt-4 p-4 bg-red-100 m-5 text-red-700 rounded max-w-7xl mx-auto">
            {error}
          </div>
        )}
        <section aria-labelledby="action-list-title" className="h-full">
          <h2 id="action-list-title" className="text-3xl font-bold mb-6 text-blue-800 border-b-2 border-blue-200 pb-2" ref={headingRef}>
            Accessibility Tools
          </h2>
          
          {/* Action buttons moved below the title */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row items-center justify-left gap-4">
              <button
                onClick={handleAnalyzeCurrentPage}
                disabled={isLoading}
                className="w-full md:w-auto inline-flex justify-center items-center bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-300 text-white font-bold px-8 py-4 rounded-lg transition-colors text-xl focus:outline-none focus:ring-offset-2 shadow-md"
                aria-label="Analyze the current page"
              >
                <span className="mr-3">Analyze current page</span>
                {isLoading ? (
                  <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
              
              <Link 
                href="/analyze"
                className="w-full md:w-auto inline-flex justify-center items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 text-white font-bold px-8 py-4 rounded-lg transition-colors text-xl focus:outline-none focus:ring-offset-2 shadow-md"
                aria-label="Analyze a new web page"
              >
                <span className="mr-3">Analyze new page</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </div>
          
          {/* Responsive card grid layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-blue-700">Available Actions</h3>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  Tools
                </span>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <ActionsList />
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-blue-700">Quick Guide</h3>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  Information
                </span>
              </div>
              <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed text-lg">
                  Improve web page accessibility in a few clicks:
                </p>
                <ul className="list-disc pl-5 space-y-3 text-gray-700 text-lg">
                  <li>Select <strong>"Analyze current page"</strong> to evaluate the open web page</li>
                  <li>Select <strong>"Analyze new page"</strong> to start a new web search</li>
                </ul>
                <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
                  <p className="text-blue-700 font-medium text-lg">
                  Customize the display through the accessibility settings with the button in the bottom right
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-white border-t-2 border-gray-200 p-6 text-center">
        <p className="text-gray-700">© {new Date().getFullYear()} Unveil - Web Accessibility Tools</p>
      </footer>
    </div>
  );
}
