'use client';

import { useState, useEffect } from 'react';
import { UserConfig } from '../types';
import { getUserConfig, saveUserConfig, updateUserConfig } from '../utils/storage';

export const useUserConfig = () => {
  const [config, setConfig] = useState<UserConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Funzione per caricare la configurazione
  const loadConfig = () => {
    try {
      const savedConfig = getUserConfig();
      setConfig(savedConfig);
      return savedConfig;
    } catch (error) {
      console.error('Errore nel caricamento della configurazione:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Carica la configurazione al mount del componente
  useEffect(() => {
    loadConfig();
  }, []);

  // Ascolta gli eventi di storage per sincronizzare tra diverse schede/finestre
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'user-accessibility-config') {
        loadConfig();
      }
    };

    // Aggiungi l'event listener
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageChange);
    }

    // Rimuovi l'event listener al cleanup
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('storage', handleStorageChange);
      }
    };
  }, []);

  const updateConfig = (updates: Partial<UserConfig>) => {
    try {
      const updatedConfig = updateUserConfig(updates);
      setConfig(updatedConfig);
      return updatedConfig;
    } catch (error) {
      console.error('Errore nell\'aggiornamento della configurazione:', error);
      return config || {};
    }
  };

  const resetConfig = () => {
    try {
      saveUserConfig({});
      setConfig({});
    } catch (error) {
      console.error('Errore nel reset della configurazione:', error);
    }
  };

  return {
    config,
    isLoading,
    updateConfig,
    resetConfig,
  };
}; 