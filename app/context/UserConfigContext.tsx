'use client';

import { createContext, useContext, ReactNode } from 'react';
import { UserConfig } from '../types';
import { useUserConfig } from '../hooks/useUserConfig';

interface UserConfigContextType {
  config: UserConfig | null;
  isLoading: boolean;
  updateConfig: (updates: Partial<UserConfig>) => UserConfig;
  resetConfig: () => void;
}

const UserConfigContext = createContext<UserConfigContextType | undefined>(undefined);

export const UserConfigProvider = ({ children }: { children: ReactNode }) => {
  const { config, isLoading, updateConfig, resetConfig } = useUserConfig();

  return (
    <UserConfigContext.Provider value={{ config, isLoading, updateConfig, resetConfig }}>
      {children}
    </UserConfigContext.Provider>
  );
};

export const useUserConfigContext = () => {
  const context = useContext(UserConfigContext);
  if (context === undefined) {
    throw new Error('useUserConfigContext deve essere usato all\'interno di un UserConfigProvider');
  }
  return context;
}; 