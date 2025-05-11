'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserConfigContext } from '../context/UserConfigContext';

export default function OnboardingPage() {
  const router = useRouter();
  const { config, updateConfig } = useUserConfigContext();
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  
  // Controlla se ci sono configurazioni già salvate
  useEffect(() => {
    if (config) {
      // Pre-popola il form con le configurazioni esistenti
      setFormData({
        isDyslexic: config.isDyslexic || false,
        isColorBlind: !!config.isColorBlind,
        colorBlindType: typeof config.isColorBlind === 'string' ? config.isColorBlind : '',
        isDeaf: config.isDeaf || false,
        fontSize: config.fontSize || 'normal',
        highContrast: config.highContrast || false,
        reduceMotion: config.reduceMotion || false,
      });
    }
  }, [config]);
  
  const [formData, setFormData] = useState({
    isDyslexic: false,
    isColorBlind: false,
    colorBlindType: '',
    isDeaf: false,
    fontSize: 'normal',
    highContrast: false,
    reduceMotion: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prepara i dati per il salvataggio
    const configData = {
      isDyslexic: formData.isDyslexic,
      isColorBlind: formData.isColorBlind ? (formData.colorBlindType || true) : false,
      isDeaf: formData.isDeaf,
      fontSize: formData.fontSize as 'normal' | 'large' | 'extra-large',
      highContrast: formData.highContrast,
      reduceMotion: formData.reduceMotion,
    };
    
    try {
      // Salva nel localStorage
      updateConfig(configData);
      
      // Aggiungi visualizzazione di stato
      setSaveStatus('Configurazione salvata con successo!');
      
      // Verifica direttamente il localStorage
      const stored = localStorage.getItem('user-accessibility-config');
      console.log('Stored config:', stored);
      
      // Reindirizza dopo un breve ritardo
      setTimeout(() => {
        router.push('/');
      }, 1500);
    } catch (error) {
      console.error('Errore nel salvataggio:', error);
      setSaveStatus('Errore nel salvataggio della configurazione.');
    }
  };

  return (
    <div className="min-h-screen bg-white p-10">
      <div className="max-w-2xl mx-auto p-8 bg-white rounded-lg shadow-sm border border-gray-200">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Configurazione di Accessibilità</h1>
        
        {saveStatus && (
          <div className={`mb-6 p-4 rounded-lg border ${saveStatus.includes('successo') ? 'bg-green-50 text-green-800 border-green-200' : 'bg-red-50 text-red-800 border-red-200'}`} 
               role="alert" 
               aria-live="polite">
            <p className="text-lg font-medium">{saveStatus}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <fieldset className="space-y-6 border-b border-gray-200 pb-6">
            <legend className="text-xl font-semibold text-gray-700 mb-4">Preferenze visive</legend>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="isDyslexic"
                  checked={formData.isDyslexic}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-gray-400 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-lg text-gray-800">Ho la dislessia</span>
              </label>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
              <div className="space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isColorBlind"
                    checked={formData.isColorBlind}
                    onChange={handleChange}
                    className="w-5 h-5 rounded border-gray-400 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-lg text-gray-800">Ho il daltonismo</span>
                </label>
                
                {formData.isColorBlind && (
                  <div className="ml-8 mt-3">
                    <select
                      name="colorBlindType"
                      value={formData.colorBlindType}
                      onChange={handleChange}
                      className="block w-full rounded-lg border border-gray-300 p-3 text-lg text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      aria-label="Tipo di daltonismo"
                    >
                      <option value="">Seleziona il tipo</option>
                      <option value="protanopia">Protanopia (rosso)</option>
                      <option value="deuteranopia">Deuteranopia (verde)</option>
                      <option value="tritanopia">Tritanopia (blu)</option>
                    </select>
                  </div>
                )}
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="isDeaf"
                  checked={formData.isDeaf}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-gray-400 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-lg text-gray-800">Ho difficoltà uditive</span>
              </label>
            </div>
          </fieldset>
          
          <fieldset className="space-y-6 border-b border-gray-200 pb-6">
            <legend className="text-xl font-semibold text-gray-700 mb-4">Preferenze di visualizzazione</legend>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <label className="block mb-2 text-lg text-gray-800 font-medium">Dimensione del testo</label>
              <select
                name="fontSize"
                value={formData.fontSize}
                onChange={handleChange}
                className="block w-full rounded-lg border border-gray-300 p-3 text-lg text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="normal">Normale</option>
                <option value="large">Grande</option>
                <option value="extra-large">Extra grande</option>
              </select>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="highContrast"
                  checked={formData.highContrast}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-gray-400 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-lg text-gray-800">Alto contrasto</span>
              </label>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="reduceMotion"
                  checked={formData.reduceMotion}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-gray-400 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-lg text-gray-800">Riduci movimento</span>
              </label>
            </div>
          </fieldset>
          
          <button
            type="submit"
            className="w-full bg-blue-700 text-white p-4 rounded-lg text-xl font-semibold hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300"
            aria-label="Salva configurazione"
          >
            Salva configurazione
          </button>
        </form>
      </div>
    </div>
  );
} 