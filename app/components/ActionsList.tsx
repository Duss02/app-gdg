'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { PageActionsData, ClickElement, SelectElement, InputElement } from '../types';
import { useUserConfigContext } from '../context/UserConfigContext';

export default function ActionsList() {
  const searchParams = useSearchParams();
  const { config } = useUserConfigContext();
  const [pageActions, setPageActions] = useState<PageActionsData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [actionResults, setActionResults] = useState<{[key: string]: string | null}>({});
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);
  const [inputValues, setInputValues] = useState<{[key: string]: string}>({});
  const [selectValues, setSelectValues] = useState<{[key: string]: string}>({});
  
  // Inizializza i valori per i campi select e input
  useEffect(() => {
    if (pageActions) {
      const newSelectValues: {[key: string]: string} = {};
      const newInputValues: {[key: string]: string} = {};
      
      if (pageActions.selectElements) {
        pageActions.selectElements.forEach((element, index) => {
          const id = element.id || `select-${index}`;
          newSelectValues[id] = element.options[0] || '';
        });
      }
      
      if (pageActions.inputElements) {
        pageActions.inputElements.forEach((element, index) => {
          const id = element.id || `input-${index}`;
          newInputValues[id] = '';
        });
      }
      
      setSelectValues(newSelectValues);
      setInputValues(newInputValues);
    }
  }, [pageActions]);

  useEffect(() => {
    // Ottieni i dati delle azioni dalla URL
    const actionsParam = searchParams.get('actions');
    
    if (actionsParam) {
      try {
        const decodedActions = decodeURIComponent(actionsParam);
        const parsedActions = JSON.parse(decodedActions) as PageActionsData;
        setPageActions(parsedActions);
      } catch (e) {
        console.error('Errore nel parsing dei dati delle azioni:', e);
        setError('Errore nel parsing dei dati delle azioni');
      }
    }
  }, [searchParams]);

  // Funzione per aggiornare il valore di un input
  const handleInputChange = (id: string, value: string) => {
    setInputValues(prev => ({
      ...prev,
      [id]: value
    }));
  };
  
  // Funzione per aggiornare il valore di un select
  const handleSelectChange = (id: string, value: string) => {
    setSelectValues(prev => ({
      ...prev,
      [id]: value
    }));
  };

  // Funzione per eseguire un'azione cliccabile
  const handleClickAction = async (element: ClickElement) => {
    const elementId = element.id || `click-${Math.random().toString(36).substring(2, 9)}`;
    setActionInProgress(elementId);
    
    try {
      const response = await fetch('http://localhost:8000/execute-action', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action_type: 'click',
          element_id: element.id,
          element_label: element.label,
          element_description: element.description
        }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        setActionResults(prev => ({
          ...prev,
          [elementId]: result.result
        }));
      } else {
        setActionResults(prev => ({
          ...prev,
          [elementId]: `Errore: ${result.message || 'Impossibile eseguire l\'azione'}`
        }));
      }
    } catch (err) {
      console.error('Errore nella chiamata API:', err);
      setActionResults(prev => ({
        ...prev,
        [elementId]: 'Errore di connessione al server'
      }));
    } finally {
      setActionInProgress(null);
    }
  };
  
  // Funzione per eseguire un'azione di input
  const handleInputAction = async (element: InputElement, id: string) => {
    setActionInProgress(id);
    
    try {
      const value = inputValues[id] || '';
      
      const response = await fetch('http://localhost:8000/execute-action', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action_type: 'input',
          element_id: element.id,
          element_label: element.label,
          element_description: element.description,
          element_placeholder: element.placeholder,
          value: value
        }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        setActionResults(prev => ({
          ...prev,
          [id]: result.result
        }));
      } else {
        setActionResults(prev => ({
          ...prev,
          [id]: `Errore: ${result.message || 'Impossibile eseguire l\'azione'}`
        }));
      }
    } catch (err) {
      console.error('Errore nella chiamata API:', err);
      setActionResults(prev => ({
        ...prev,
        [id]: 'Errore di connessione al server'
      }));
    } finally {
      setActionInProgress(null);
    }
  };
  
  // Funzione per eseguire un'azione di selezione
  const handleSelectAction = async (element: SelectElement, id: string) => {
    setActionInProgress(id);
    
    try {
      const value = selectValues[id] || '';
      
      const response = await fetch('http://localhost:8000/execute-action', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action_type: 'select',
          element_id: element.id,
          element_label: element.label,
          element_description: element.description,
          value: value
        }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        setActionResults(prev => ({
          ...prev,
          [id]: result.result
        }));
      } else {
        setActionResults(prev => ({
          ...prev,
          [id]: `Errore: ${result.message || 'Impossibile eseguire l\'azione'}`
        }));
      }
    } catch (err) {
      console.error('Errore nella chiamata API:', err);
      setActionResults(prev => ({
        ...prev,
        [id]: 'Errore di connessione al server'
      }));
    } finally {
      setActionInProgress(null);
    }
  };

  // Funzione per applicare stili di accessibilità in base alla configurazione utente
  const getAccessibilityStyles = () => {
    const styles: React.CSSProperties = {};
    
    if (!config) return styles;
    
    if (config.fontSize === 'large') {
      styles.fontSize = '1.2rem';
    } else if (config.fontSize === 'extra-large') {
      styles.fontSize = '1.5rem';
    }
    
    if (config.isDyslexic) {
      styles.fontFamily = 'Arial, sans-serif';
      styles.lineHeight = '1.8';
    }
    
    if (config.highContrast) {
      styles.backgroundColor = '#000';
      styles.color = '#fff';
    }
    
    return styles;
  };

  if (error) {
    return <div className="p-4 text-red-600">{error}</div>;
  }

  if (!pageActions) {
    return <div className="p-4">Nessuna azione disponibile</div>;
  }

  return (
    <div style={getAccessibilityStyles()} className="p-4 space-y-8">
      <h2 className="text-xl font-bold mb-4">Azioni disponibili in questa pagina</h2>
      
      {pageActions.clickElements && pageActions.clickElements.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Elementi cliccabili</h3>
          <ul className="space-y-2">
            {pageActions.clickElements.map((element, index) => {
              const elementId = element.id || `click-${index}`;
              const hasResult = actionResults[elementId] !== undefined;
              
              return (
                <li key={`click-${element.id || index}`} className="p-3 border rounded hover:bg-gray-50">
                  <div className="font-medium">{element.label}</div>
                  <div className="text-sm text-gray-600 mb-2">{element.description}</div>
                  
                  <div className="mt-2">
                    <button
                      onClick={() => handleClickAction(element)}
                      disabled={actionInProgress === elementId}
                      className={`px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 ${
                        actionInProgress === elementId ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      {actionInProgress === elementId ? 'Esecuzione...' : 'Esegui azione'}
                    </button>
                  </div>
                  
                  {hasResult && (
                    <div className="mt-2 p-2 bg-gray-100 rounded text-sm">
                      <div className="font-semibold">Risultato:</div>
                      <div>{actionResults[elementId]}</div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
      
      {pageActions.selectElements && pageActions.selectElements.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Elementi di selezione</h3>
          <ul className="space-y-4">
            {pageActions.selectElements.map((element, index) => {
              const elementId = element.id || `select-${index}`;
              const hasResult = actionResults[elementId] !== undefined;
              
              return (
                <li key={`select-${element.id || index}`} className="p-3 border rounded">
                  <div className="font-medium">{element.label}</div>
                  <div className="text-sm text-gray-600 mb-2">{element.description}</div>
                  
                  <div className="flex space-x-2">
                    <select
                      className="block p-2 border rounded"
                      value={selectValues[elementId] || ''}
                      onChange={(e) => handleSelectChange(elementId, e.target.value)}
                    >
                      {element.options.map((option, optIndex) => (
                        <option key={`option-${optIndex}`} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    
                    <button
                      onClick={() => handleSelectAction(element, elementId)}
                      disabled={actionInProgress === elementId}
                      className={`px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 ${
                        actionInProgress === elementId ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      {actionInProgress === elementId ? 'Esecuzione...' : 'Esegui azione'}
                    </button>
                  </div>
                  
                  {hasResult && (
                    <div className="mt-2 p-2 bg-gray-100 rounded text-sm">
                      <div className="font-semibold">Risultato:</div>
                      <div>{actionResults[elementId]}</div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
      
      {pageActions.inputElements && pageActions.inputElements.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Campi di input</h3>
          <ul className="space-y-4">
            {pageActions.inputElements.map((element, index) => {
              const elementId = element.id || `input-${index}`;
              const hasResult = actionResults[elementId] !== undefined;
              
              return (
                <li key={`input-${element.id || index}`} className="p-3 border rounded">
                  <div className="font-medium">{element.label}</div>
                  <div className="text-sm text-gray-600 mb-2">{element.description}</div>
                  
                  <div className="flex space-x-2">
                    <input
                      type={element.type}
                      placeholder={element.placeholder}
                      className="block p-2 border rounded flex-grow"
                      value={inputValues[elementId] || ''}
                      onChange={(e) => handleInputChange(elementId, e.target.value)}
                    />
                    
                    <button
                      onClick={() => handleInputAction(element, elementId)}
                      disabled={actionInProgress === elementId}
                      className={`px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 ${
                        actionInProgress === elementId ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      {actionInProgress === elementId ? 'Esecuzione...' : 'Esegui azione'}
                    </button>
                  </div>
                  
                  {hasResult && (
                    <div className="mt-2 p-2 bg-gray-100 rounded text-sm">
                      <div className="font-semibold">Risultato:</div>
                      <div>{actionResults[elementId]}</div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
} 