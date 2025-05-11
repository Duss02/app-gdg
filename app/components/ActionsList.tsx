'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useUserConfigContext } from '../context/UserConfigContext';

// Definizione delle interfacce per il nuovo formato JSON
interface BaseElement {
  id: string | null;
  label: string;
  description: string;
  importance: number;
}

interface ClickElement extends BaseElement {
  type: 'click';
}

interface SelectElement extends BaseElement {
  type: 'select';
  options: string[];
}

interface InputElement extends BaseElement {
  type: 'input';
  placeholder: string;
  inputType: string;
}

interface FormInputElement {
  id: string | null;
  label: string;
  description: string;
  placeholder: string;
  inputType: string;
  required: boolean;
}

interface FormElement extends BaseElement {
  type: 'form';
  submitButton: {
    id: string | null;
    label: string;
  };
  inputs: FormInputElement[];
}

type Element = ClickElement | SelectElement | InputElement | FormElement;

interface PageActionsData {
  elements: Element[];
}

export default function ActionsList() {
  const searchParams = useSearchParams();
  const { config } = useUserConfigContext();
  const [pageActions, setPageActions] = useState<PageActionsData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [actionResults, setActionResults] = useState<{[key: string]: string | null}>({});
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);
  const [inputValues, setInputValues] = useState<{[key: string]: string}>({});
  const [selectValues, setSelectValues] = useState<{[key: string]: string}>({});
  const [formValues, setFormValues] = useState<{[key: string]: {[key: string]: string}}>({});
  const [openForms, setOpenForms] = useState<{[key: string]: boolean}>({});
  
  // Inizializza i valori per i campi select e input
  useEffect(() => {
    if (pageActions) {
      const newSelectValues: {[key: string]: string} = {};
      const newInputValues: {[key: string]: string} = {};
      const newFormValues: {[key: string]: {[key: string]: string}} = {};
      const newOpenForms: {[key: string]: boolean} = {};
      
      pageActions.elements.forEach((element, index) => {
        const elementId = `element-${index}`;
        
        if (element.type === 'select') {
          newSelectValues[elementId] = element.options[0] || '';
        } else if (element.type === 'input') {
          newInputValues[elementId] = '';
        } else if (element.type === 'form') {
          const formInputs: {[key: string]: string} = {};
          element.inputs.forEach((input, inputIndex) => {
            const inputId = `input-${index}-${inputIndex}`;
            formInputs[inputId] = '';
          });
          newFormValues[elementId] = formInputs;
          
          // Apri automaticamente il form se ha un'importanza alta
          if (element.importance >= 8 || index === 0) {
            newOpenForms[elementId] = true;
          } else {
            newOpenForms[elementId] = false;
          }
        }
      });
      
      setSelectValues(newSelectValues);
      setInputValues(newInputValues);
      setFormValues(newFormValues);
      setOpenForms(newOpenForms);
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
          element_description: element.description,
          importance: element.importance
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
          input_type: element.inputType,
          importance: element.importance,
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
          importance: element.importance,
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

  // Funzione per gestire l'apertura/chiusura dei form
  const toggleForm = (id: string) => {
    setOpenForms(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Funzione per aggiornare i valori dei campi dei form
  const handleFormInputChange = (formId: string, inputId: string, value: string) => {
    setFormValues(prev => ({
      ...prev,
      [formId]: {
        ...prev[formId],
        [inputId]: value
      }
    }));
  };

  // Funzione per inviare un form
  const handleFormSubmit = async (element: FormElement, formId: string) => {
    setActionInProgress(formId);
    
    try {
      const formData = formValues[formId] || {};
      
      const response = await fetch('http://localhost:8000/execute-action', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action_type: 'form',
          element_id: element.id,
          element_label: element.submitButton.label,
          element_description: element.description,
          importance: element.importance,
          form_inputs: element.inputs.map((input, inputIndex) => {
            const inputId = `input-${formId.split('-')[1]}-${inputIndex}`;
            return {
              id: inputId,
              label: input.label || "Campo",
              value: formData[inputId] || ''
            };
          })
        }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        setActionResults(prev => ({
          ...prev,
          [formId]: result.result
        }));
        // Chiudi il form dopo l'invio con successo
        setOpenForms(prev => ({
          ...prev,
          [formId]: false
        }));
      } else {
        setActionResults(prev => ({
          ...prev,
          [formId]: `Errore: ${result.message || 'Impossibile eseguire l\'azione'}`
        }));
      }
    } catch (err) {
      console.error('Errore nella chiamata API:', err);
      setActionResults(prev => ({
        ...prev,
        [formId]: 'Errore di connessione al server'
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
      styles.fontSize = '1.25rem';
    } else if (config.fontSize === 'extra-large') {
      styles.fontSize = '1.6rem';
    }
    
    if (config.isDyslexic) {
      styles.fontFamily = 'Arial, sans-serif';
      styles.lineHeight = '1.8';
    }
    
    if (config.highContrast) {
      styles.backgroundColor = '#ffffff';
      styles.color = '#000000';
    }
    
    return styles;
  };

  if (error) {
    return (
      <div className="p-6 bg-red-100 text-red-700 border-2 border-red-400 rounded-md font-medium max-w-3xl mx-auto">
        {error}
      </div>
    );
  }

  if (!pageActions) {
    return (
      <div className="p-6 bg-gray-50 text-gray-800 border-2 border-gray-300 rounded-md font-medium max-w-3xl mx-auto">
        Nessuna azione disponibile
      </div>
    );
  }

  // Ordina gli elementi per importanza (decrescente)
  const sortedElements = [...pageActions.elements].sort((a, b) => b.importance - a.importance);

  return (
    <div style={getAccessibilityStyles()} className="p-6 bg-white max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-gray-900 border-b-2 border-gray-300 pb-4">Azioni disponibili in questa pagina</h2>
      
      <div className="space-y-8">
        <ul className="space-y-4">
          {sortedElements.map((element, index) => {
            const elementId = `element-${index}`;
            const hasResult = actionResults[elementId] !== undefined;
            
            return (
              <li 
                key={`element-${index}`} 
                className="p-5 border-2 border-gray-300 rounded-lg hover:bg-gray-50 hover:border-blue-300 shadow-sm transition-all cursor-pointer"
                onClick={() => {
                  if (element.type === 'click') {
                    handleClickAction(element as ClickElement);
                  } else if (element.type === 'form') {
                    toggleForm(elementId);
                  }
                }}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="font-bold text-xl text-gray-900 mb-1">
                      {element.type === 'form' ? (element as FormElement).submitButton.label : element.label}
                    </div>
                    <div className="text-base text-gray-700">{element.description}</div>
                  </div>
                </div>
                
                {element.type === 'select' && (
                  <div className="mt-4" onClick={(e) => e.stopPropagation()}>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <select
                        className="block p-3 border-2 border-gray-400 rounded-md text-lg font-medium bg-white focus:outline-none focus:ring-4 focus:ring-blue-300 focus:border-blue-500"
                        value={selectValues[elementId] || ''}
                        onChange={(e) => handleSelectChange(elementId, e.target.value)}
                      >
                        {(element as SelectElement).options.map((option, optIndex) => (
                          <option key={`option-${optIndex}`} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                      
                      <button
                        onClick={() => handleSelectAction(element as SelectElement, elementId)}
                        disabled={actionInProgress === elementId}
                        className={`px-6 py-3 bg-blue-700 text-white rounded-md font-bold text-lg hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-md ${
                          actionInProgress === elementId ? 'opacity-70 cursor-not-allowed' : ''
                        }`}
                      >
                        {actionInProgress === elementId ? 'Esecuzione...' : 'Conferma'}
                      </button>
                    </div>
                  </div>
                )}
                
                {element.type === 'input' && (
                  <div className="mt-4" onClick={(e) => e.stopPropagation()}>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <input
                        type={(element as InputElement).inputType}
                        placeholder={(element as InputElement).placeholder}
                        className="block p-3 border-2 border-gray-400 rounded-md text-lg text-black font-medium bg-white focus:outline-none focus:ring-4 focus:ring-blue-300 focus:border-blue-500 flex-grow"
                        value={inputValues[elementId] || ''}
                        onChange={(e) => handleInputChange(elementId, e.target.value)}
                        style={{caretColor: 'black'}}
                      />
                      
                      <button
                        onClick={() => handleInputAction(element as InputElement, elementId)}
                        disabled={actionInProgress === elementId}
                        className={`px-6 py-3 bg-blue-700 text-white rounded-md font-bold text-lg hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-md ${
                          actionInProgress === elementId ? 'opacity-70 cursor-not-allowed' : ''
                        }`}
                      >
                        {actionInProgress === elementId ? 'Esecuzione...' : 'Conferma'}
                      </button>
                    </div>
                  </div>
                )}
                
                {element.type === 'form' && openForms[elementId] && (
                  <div className="mt-4 bg-gray-50 p-4 rounded-lg border-2 border-gray-300" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-xl font-bold">{(element as FormElement).submitButton.label}</h4>
                      <button 
                        onClick={() => toggleForm(elementId)}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    
                    <form className="space-y-4" onSubmit={(e) => {
                      e.preventDefault();
                      handleFormSubmit(element as FormElement, elementId);
                    }}>
                      {(element as FormElement).inputs.map((input, inputIndex) => {
                        const inputId = `input-${index}-${inputIndex}`;
                        return (
                          <div key={`form-field-${inputIndex}`} className="space-y-2">
                            <label className="block font-medium text-gray-700">
                              {input.label}
                              {input.required && <span className="text-red-500 ml-1">*</span>}
                            </label>
                            <input
                              type={input.inputType}
                              placeholder={input.placeholder}
                              required={input.required}
                              className="w-full p-3 border-2 border-gray-400 rounded-md text-lg text-black bg-white focus:outline-none focus:ring-4 focus:ring-blue-300 focus:border-blue-500"
                              value={formValues[elementId]?.[inputId] || ''}
                              onChange={(e) => handleFormInputChange(elementId, inputId, e.target.value)}
                              style={{caretColor: 'black'}}
                            />
                            {input.description && (
                              <p className="text-sm text-gray-500">{input.description}</p>
                            )}
                          </div>
                        );
                      })}
                      
                      <button
                        type="submit"
                        disabled={actionInProgress === elementId}
                        className={`w-full px-6 py-3 bg-blue-700 text-white rounded-md font-bold text-lg hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-md ${
                          actionInProgress === elementId ? 'opacity-70 cursor-not-allowed' : ''
                        }`}
                      >
                        {actionInProgress === elementId ? 'Invio in corso...' : (element as FormElement).submitButton.label}
                      </button>
                    </form>
                  </div>
                )}
                
                {hasResult && (
                  <div className="mt-4 p-4 bg-gray-100 border-2 border-gray-300 rounded-md">
                    <div className="font-bold text-lg mb-1">Risultato:</div>
                    <div className="text-gray-800">{actionResults[elementId]}</div>
                  </div>
                )}
                
                {actionInProgress === elementId && element.type === 'click' && (
                  <div className="mt-4 flex items-center text-blue-700">
                    <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Esecuzione in corso...</span>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
} 