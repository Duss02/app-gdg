'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useUserConfigContext } from '../context/UserConfigContext';

export default function AccessibilityButton() {
  const [isOpen, setIsOpen] = useState(false);
  const { config, resetConfig } = useUserConfigContext();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={toggleMenu}
        className="rounded-full bg-blue-600 text-white w-12 h-12 flex items-center justify-center shadow-lg hover:bg-blue-700 focus:outline-none"
        aria-label="Impostazioni di accessibilità"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute bottom-16 right-0 bg-white rounded-lg shadow-lg p-4 w-64">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold">Accessibilità</h3>
            <button
              onClick={toggleMenu}
              className="text-gray-500 hover:text-gray-700"
              aria-label="Chiudi menu"
            >
              &times;
            </button>
          </div>

          <div className="space-y-2">
            <Link
              href="/analyze"
              className="block w-full py-2 px-3 bg-green-100 text-green-700 rounded text-center hover:bg-green-200"
            >
              Analizza nuova pagina
            </Link>
            
            <Link
              href="/onboarding"
              className="block w-full py-2 px-3 bg-blue-100 text-blue-700 rounded text-center hover:bg-blue-200"
            >
              Modifica preferenze
            </Link>
            
            <button
              onClick={() => {
                resetConfig();
                toggleMenu();
              }}
              className="block w-full py-2 px-3 bg-red-100 text-red-700 rounded text-center hover:bg-red-200"
            >
              Ripristina impostazioni
            </button>
          </div>
          
          {config && (
            <div className="mt-3 pt-3 border-t text-xs text-gray-600">
              <p>Preferenze attive:</p>
              <ul className="mt-1">
                {config.isDyslexic && <li>• Supporto dislessia</li>}
                {config.isColorBlind && <li>• Supporto daltonismo</li>}
                {config.isDeaf && <li>• Supporto sordità</li>}
                {config.fontSize !== 'normal' && <li>• Testo {config.fontSize === 'large' ? 'grande' : 'extra grande'}</li>}
                {config.highContrast && <li>• Alto contrasto</li>}
                {config.reduceMotion && <li>• Movimento ridotto</li>}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 