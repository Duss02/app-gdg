'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useUserConfigContext } from '../context/UserConfigContext';

export default function AccessibilityButton() {
  const [isOpen, setIsOpen] = useState(false);
  const { config, resetConfig } = useUserConfigContext();
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Chiude il menu quando si clicca fuori
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={toggleMenu}
        className="rounded-full bg-blue-700 text-white w-16 h-16 flex items-center justify-center shadow-xl hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
        aria-label="Impostazioni di accessibilità"
        aria-expanded={isOpen}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          className="w-8 h-8"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
          />
        </svg>
      </button>

      {isOpen && (
        <div 
          ref={menuRef}
          className="absolute bottom-16 right-0 bg-white rounded-lg shadow-2xl p-6 w-80 border-2 border-gray-300 transition-all duration-200 animate-fadeIn"
          aria-label="Menu di accessibilità"
        >
          <div className="flex justify-between items-center mb-5">
            <h3 className="font-bold text-xl text-gray-900">Accessibilità</h3>
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-gray-900 p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Chiudi menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          <div className="space-y-4">
            
            
            <Link
              href="/onboarding"
              className="block w-full py-3 px-4 bg-blue-700 text-white rounded-md text-center font-bold text-lg hover:bg-blue-800 shadow-md transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300"
            >
              Modifica preferenze
            </Link>
            
            <button
              onClick={() => {
                resetConfig();
                toggleMenu();
              }}
              className="block w-full py-3 px-4 bg-white border-2 border-red-600 text-red-700 rounded-md text-center font-bold text-lg hover:bg-red-50 shadow-md transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-red-300"
            >
              Ripristina impostazioni
            </button>
          </div>
          
          {config && Object.values(config).some(value => value === true || (typeof value === 'string' && value !== 'normal')) && (
            <div className="mt-5 pt-4 border-t-2 border-gray-300 text-base text-gray-800">
              <p className="font-bold text-lg">Preferenze attive:</p>
              <ul className="mt-3 space-y-2">
                {config.isDyslexic && (
                  <li className="flex items-center">
                    <span className="w-3 h-3 bg-blue-700 rounded-full mr-3"></span>
                    Supporto dislessia
                  </li>
                )}
                {config.isColorBlind && (
                  <li className="flex items-center">
                    <span className="w-3 h-3 bg-blue-700 rounded-full mr-3"></span>
                    Supporto daltonismo
                  </li>
                )}
                {config.isDeaf && (
                  <li className="flex items-center">
                    <span className="w-3 h-3 bg-blue-700 rounded-full mr-3"></span>
                    Supporto sordità
                  </li>
                )}
                {config.fontSize !== 'normal' && (
                  <li className="flex items-center">
                    <span className="w-3 h-3 bg-blue-700 rounded-full mr-3"></span>
                    Testo {config.fontSize === 'large' ? 'grande' : 'extra grande'}
                  </li>
                )}
                {config.highContrast && (
                  <li className="flex items-center">
                    <span className="w-3 h-3 bg-blue-700 rounded-full mr-3"></span>
                    Alto contrasto
                  </li>
                )}
                {config.reduceMotion && (
                  <li className="flex items-center">
                    <span className="w-3 h-3 bg-blue-700 rounded-full mr-3"></span>
                    Movimento ridotto
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 