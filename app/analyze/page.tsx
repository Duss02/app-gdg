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

  // Funzione per applicare stili di accessibilità in base alla configurazione utente
  const getAccessibilityStyles = () => {
    const styles: React.CSSProperties = {};
    
    if (!config) return styles;
    
    if (config.fontSize === 'large') {
      styles.fontSize = '1.2rem';
    } else if (config.fontSize === 'extra-large') {
      styles.fontSize = '1.5rem';
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
    <div className="min-h-screen p-8 sm:p-20" style={getAccessibilityStyles()}>
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Analisi Pagina Web</h1>
        <p className="text-gray-600">
          Inserisci l'URL di una pagina web da analizzare per l'accessibilità.
        </p>
      </header>

      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-xl">
        <div className="mb-4">
          <label htmlFor="url" className="block mb-2 font-medium">
            URL della pagina
          </label>
          <input
            type="url"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full p-3 border rounded"
            placeholder="https://example.com"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`px-6 py-3 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 ${
            isLoading ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? 'Analisi in corso...' : 'Analizza pagina'}
        </button>
      </form>
    </div>
  );
} 