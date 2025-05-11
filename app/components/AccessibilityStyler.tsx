'use client';

import { useEffect } from 'react';
import { useUserConfigContext } from '../context/UserConfigContext';

export const AccessibilityStyler = () => {
  const { config } = useUserConfigContext();

  useEffect(() => {
    if (!config) return;

    // Seleziona il tag html
    const htmlElement = document.documentElement;
    
    // Applica classe per dislessia
    if (config.isDyslexic) {
      htmlElement.classList.add('dyslexic');
    } else {
      htmlElement.classList.remove('dyslexic');
    }

    // Applica classe per daltonismo
    htmlElement.classList.remove('protanopia', 'deuteranopia', 'tritanopia');
    if (config.isColorBlind && typeof config.isColorBlind === 'string') {
      htmlElement.classList.add(config.isColorBlind);
    }

    // Applica dimensioni del font
    htmlElement.classList.remove('font-size-large', 'font-size-extra-large');
    if (config.fontSize && config.fontSize !== 'normal') {
      htmlElement.classList.add(`font-size-${config.fontSize}`);
    }

    // Applica alto contrasto
    if (config.highContrast) {
      htmlElement.classList.add('high-contrast');
    } else {
      htmlElement.classList.remove('high-contrast');
    }

    // Applica riduzione del movimento
    if (config.reduceMotion) {
      htmlElement.classList.add('reduce-motion');
    } else {
      htmlElement.classList.remove('reduce-motion');
    }

  }, [config]);

  // Questo componente non renderizza nulla visualmente
  return null;
}; 