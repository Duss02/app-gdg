'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserConfigContext } from '../context/UserConfigContext';

export default function OnboardingPage() {
  const router = useRouter();
  const { config, updateConfig } = useUserConfigContext();
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  
  // Check if there are already saved configurations
  useEffect(() => {
    if (config) {
      // Pre-populate the form with existing configurations
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
    
    // Prepare data for saving
    const configData = {
      isDyslexic: formData.isDyslexic,
      isColorBlind: formData.isColorBlind ? (formData.colorBlindType || true) : false,
      isDeaf: formData.isDeaf,
      fontSize: formData.fontSize as 'normal' | 'large' | 'extra-large',
      highContrast: formData.highContrast,
      reduceMotion: formData.reduceMotion,
    };
    
    try {
      // Save to localStorage
      updateConfig(configData);
      
      // Add status display
      setSaveStatus('Configuration saved successfully!');
      
      // Verify directly in localStorage
      const stored = localStorage.getItem('user-accessibility-config');
      console.log('Stored config:', stored);
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push('/');
      }, 1500);
    } catch (error) {
      console.error('Error saving:', error);
      setSaveStatus('Error saving the configuration.');
    }
  };

  return (
    <div className="min-h-screen bg-white p-10">
      <div className="max-w-2xl mx-auto p-8 bg-white rounded-lg shadow-sm border border-gray-200">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Accessibility Configuration</h1>
        
        {saveStatus && (
          <div className={`mb-6 p-4 rounded-lg border ${saveStatus.includes('success') ? 'bg-green-50 text-green-800 border-green-200' : 'bg-red-50 text-red-800 border-red-200'}`} 
               role="alert" 
               aria-live="polite">
            <p className="text-lg font-medium">{saveStatus}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <fieldset className="space-y-6 border-b border-gray-200 pb-6">
            <legend className="text-xl font-semibold text-gray-700 mb-4">Visual preferences</legend>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="isDyslexic"
                  checked={formData.isDyslexic}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-gray-400 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-lg text-gray-800">I have dyslexia</span>
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
                  <span className="text-lg text-gray-800">I have color blindness</span>
                </label>
                
                {formData.isColorBlind && (
                  <div className="ml-8 mt-3">
                    <select
                      name="colorBlindType"
                      value={formData.colorBlindType}
                      onChange={handleChange}
                      className="block w-full rounded-lg border border-gray-300 p-3 text-lg text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      aria-label="Color blindness type"
                    >
                      <option value="">Select type</option>
                      <option value="protanopia">Protanopia (red)</option>
                      <option value="deuteranopia">Deuteranopia (green)</option>
                      <option value="tritanopia">Tritanopia (blue)</option>
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
                <span className="text-lg text-gray-800">I have hearing difficulties</span>
              </label>
            </div>
          </fieldset>
          
          <fieldset className="space-y-6 border-b border-gray-200 pb-6">
            <legend className="text-xl font-semibold text-gray-700 mb-4">Display preferences</legend>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <label className="block mb-2 text-lg text-gray-800 font-medium">Text size</label>
              <select
                name="fontSize"
                value={formData.fontSize}
                onChange={handleChange}
                className="block w-full rounded-lg border border-gray-300 p-3 text-lg text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="normal">Normal</option>
                <option value="large">Large</option>
                <option value="extra-large">Extra large</option>
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
                <span className="text-lg text-gray-800">High contrast</span>
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
                <span className="text-lg text-gray-800">Reduce motion</span>
              </label>
            </div>
          </fieldset>
          
          <button
            type="submit"
            className="w-full bg-blue-700 text-white p-4 rounded-lg text-xl font-semibold hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300"
            aria-label="Save configuration"
          >
            Save configuration
          </button>
        </form>
      </div>
    </div>
  );
} 