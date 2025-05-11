// Tipi per le configurazioni dell'utente
export interface UserConfig {
  isDyslexic?: boolean;
  isColorBlind?: string | boolean; // tipo di daltonismo o boolean
  isDeaf?: boolean;
  fontSize?: 'normal' | 'large' | 'extra-large';
  highContrast?: boolean;
  reduceMotion?: boolean;
  // altre configurazioni possibili
}

// Tipi per gli elementi dell'interfaccia
export interface ClickElement {
  id: string | null;
  label: string;
  description: string;
}

export interface SelectElement {
  id: string | null;
  label: string;
  description: string;
  options: string[];
}

export interface InputElement {
  id: string | null;
  label: string;
  description: string;
  placeholder: string;
  type: 'text' | 'number' | 'email' | 'password';
}

export interface PageActionsData {
  clickElements?: ClickElement[];
  selectElements?: SelectElement[];
  inputElements?: InputElement[];
} 