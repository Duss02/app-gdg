'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserConfigContext } from '../context/UserConfigContext';

export default function AnalyzePage() {
  const router = useRouter();
  const { config } = useUserConfigContext();
  const [url, setUrl] = useState('https://google.com');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to apply accessibility styles based on user configuration
  const getAccessibilityStyles = () => {
    const styles: React.CSSProperties = {};
    
    if (!config) return styles;
    
    if (config.fontSize === 'large') {
      styles.fontSize = '1.25rem';
    } else if (config.fontSize === 'extra-large') {
      styles.fontSize = '1.6rem';
    }
    
    if (config.isDyslexic) {
      styles.fontFamily = 'Arial, sans-serif';
      styles.lineHeight = '1.8';
    }
    
    if (config.highContrast) {
      styles.backgroundColor = '#ffffff';
      styles.color = '#000000';
    }
    
    return styles;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8000/analyze-webpage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ link: url }),
      });

      const result = await response.json();

      if (result.success && result.data) {
        // Encode the data and redirect to the home page to display them
        const encodedData = encodeURIComponent(JSON.stringify(result.data));
        router.push(`/?actions=${encodedData}`);
      } else {
        setError(result.message || 'Error analyzing the page');
      }
    } catch (err) {
      setError('Connection error to the server. Make sure the server is running.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 sm:p-12 bg-white" style={getAccessibilityStyles()}>
      <header className="mb-10 max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 text-gray-900">Web Page Analysis</h1>
        <p className="text-lg text-gray-800">
          Enter the URL of a web page to analyze for accessibility.
        </p>
      </header>

      {error && (
        <div className="mb-8 p-5 bg-red-100 text-red-700 border-2 border-red-400 rounded-md font-medium max-w-3xl mx-auto">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto bg-gray-50 p-8 rounded-lg border-2 border-gray-300 shadow-md">
        <div className="mb-6">
          <label htmlFor="url" className="block mb-3 font-bold text-xl text-gray-900">
            Page URL
          </label>
          <input
            type="url"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full p-4 border-2 border-gray-400 rounded-md text-xl text-black font-medium bg-white focus:outline-none focus:ring-4 focus:ring-blue-300 focus:border-blue-500"
            placeholder="https://example.com"
            style={{caretColor: 'black'}}
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`px-8 py-4 bg-blue-700 text-white rounded-md font-bold text-lg hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-md ${
            isLoading ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? 'Analysis in progress...' : 'Analyze page'}
        </button>
      </form>
    </div>
  );
} 