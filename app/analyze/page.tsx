'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useUserConfigContext } from '../context/UserConfigContext';

export default function AnalyzePage() {
  const router = useRouter();
  const { config } = useUserConfigContext();
  const [url, setUrl] = useState('https://google.com');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
 

  // Funzione per applicare stili di accessibilità in base alla configurazione utente
  const getAccessibilityStyles = () => {
    const styles: React.CSSProperties = {};
    
    if (!config) return styles;
    
    if (config.fontSize === 'large') {
      styles.fontSize = '1.3rem';
    } else if (config.fontSize === 'extra-large') {
      styles.fontSize = '1.6rem';
    }
    
    if (config.isDyslexic) {
      styles.fontFamily = 'Arial, sans-serif';
      styles.lineHeight = '1.8';
    }
    
    if (config.highContrast) {
      styles.backgroundColor = '#000';
      styles.color = '#fff';
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
        // Codifica i dati e reindirizza alla home page per visualizzarli
        const encodedData = encodeURIComponent(JSON.stringify(result.data));
        router.push(`/?actions=${encodedData}`);
      } else {
        setError(result.message || 'Errore durante l\'analisi della pagina');
      }
    } catch (err) {
      setError('Errore di connessione al server. Assicurati che il server sia in esecuzione.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 sm:p-20 bg-white flex flex-col items-center justify-center" style={getAccessibilityStyles()}>
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-bold mb-4 text-gray-900">Analisi Pagina Web</h1>
        <p className="text-gray-700 text-xl max-w-2xl">
          Inserisci l'URL di una pagina web da analizzare per l'accessibilità.
        </p>
      </header>

      {error && (
        <div className="mb-8 p-6 bg-red-100 text-red-700 rounded-lg border-2 border-red-300 text-lg font-medium max-w-2xl w-full">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="w-full max-w-2xl flex flex-col items-center">
        <button
          type="submit"
          disabled={isLoading}
          className={`w-4/5 mb-10 px-10 py-6 bg-blue-700 text-white rounded-xl font-bold text-2xl hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-lg transition-all duration-200 transform hover:scale-105 ${
            isLoading ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? 'Analisi in corso...' : 'Analizza pagina'}
        </button>

        
      </form>
    </div>
  );
} 