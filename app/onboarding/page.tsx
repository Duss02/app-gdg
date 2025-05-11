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
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Configurazione di Accessibilità</h1>
      
      {saveStatus && (
        <div className={`mb-4 p-3 rounded ${saveStatus.includes('successo') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {saveStatus}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="isDyslexic"
              checked={formData.isDyslexic}
              onChange={handleChange}
              className="rounded"
            />
            <span>Ho la dislessia</span>
          </label>
          
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="isColorBlind"
                checked={formData.isColorBlind}
                onChange={handleChange}
                className="rounded"
              />
              <span>Ho il daltonismo</span>
            </label>
            
            {formData.isColorBlind && (
              <select
                name="colorBlindType"
                value={formData.colorBlindType}
                onChange={handleChange}
                className="block w-full rounded border p-2"
              >
                <option value="">Seleziona il tipo</option>
                <option value="protanopia">Protanopia (rosso)</option>
                <option value="deuteranopia">Deuteranopia (verde)</option>
                <option value="tritanopia">Tritanopia (blu)</option>
              </select>
            )}
          </div>
          
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="isDeaf"
              checked={formData.isDeaf}
              onChange={handleChange}
              className="rounded"
            />
            <span>Ho difficoltà uditive</span>
          </label>
          
          <div className="space-y-2">
            <label className="block">Dimensione del testo</label>
            <select
              name="fontSize"
              value={formData.fontSize}
              onChange={handleChange}
              className="block w-full rounded border p-2"
            >
              <option value="normal">Normale</option>
              <option value="large">Grande</option>
              <option value="extra-large">Extra grande</option>
            </select>
          </div>
          
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="highContrast"
              checked={formData.highContrast}
              onChange={handleChange}
              className="rounded"
            />
            <span>Alto contrasto</span>
          </label>
          
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="reduceMotion"
              checked={formData.reduceMotion}
              onChange={handleChange}
              className="rounded"
            />
            <span>Riduci movimento</span>
          </label>
        </div>
        
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-3 rounded font-medium hover:bg-blue-700"
        >
          Salva configurazione
        </button>
      </form>
    </div>
  );
} 