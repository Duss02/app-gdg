import { UserConfig } from '../types';

const USER_CONFIG_KEY = 'user-accessibility-config';

/**
 * Salva la configurazione utente nel localStorage
 */
export const saveUserConfig = (config: UserConfig): void => {
  if (typeof window !== 'undefined') {
    try {
      const configString = JSON.stringify(config);
      localStorage.setItem(USER_CONFIG_KEY, configString);
      console.log('Configurazione salvata con successo:', config);
    } catch (error) {
      console.error('Errore nel salvare la configurazione:', error);
    }
  }
};

/**
 * Ottiene la configurazione utente dal localStorage
 */
export const getUserConfig = (): UserConfig | null => {
  if (typeof window !== 'undefined') {
    try {
      const configString = localStorage.getItem(USER_CONFIG_KEY);
      if (!configString) return null;
      
      const config = JSON.parse(configString);
      console.log('Configurazione caricata con successo:', config);
      return config;
    } catch (error) {
      console.error('Errore nel recupero della configurazione:', error);
      return null;
    }
  }
  return null;
};

/**
 * Aggiorna la configurazione utente con nuovi valori
 */
export const updateUserConfig = (updates: Partial<UserConfig>): UserConfig => {
  try {
    const current = getUserConfig() || {};
    const updated = { ...current, ...updates };
    saveUserConfig(updated);
    return updated;
  } catch (error) {
    console.error('Errore nell\'aggiornamento della configurazione:', error);
    throw error;
  }
};

/**
 * Rimuove la configurazione utente dal localStorage
 */
export const clearUserConfig = (): void => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(USER_CONFIG_KEY);
      console.log('Configurazione rimossa con successo');
    } catch (error) {
      console.error('Errore nella rimozione della configurazione:', error);
    }
  }
}; 