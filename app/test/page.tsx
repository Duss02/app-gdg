'use client';

import Link from 'next/link';
import { PageActionsData } from '../types';

export default function TestPage() {
  // Dati di esempio per testare l'applicazione
  const exampleData: PageActionsData = {
    clickElements: [
      {
        id: 'btn-1',
        label: 'Acquista ora',
        description: 'Aggiunge il prodotto al carrello e procede al checkout'
      },
      {
        id: 'link-2',
        label: 'Scopri di più',
        description: 'Mostra dettagli aggiuntivi sul prodotto'
      }
    ],
    selectElements: [
      {
        id: 'select-1',
        label: 'Seleziona la taglia',
        description: 'Scegli la taglia del prodotto',
        options: ['S', 'M', 'L', 'XL']
      },
      {
        id: 'select-2',
        label: 'Quantità',
        description: 'Seleziona quanti prodotti vuoi acquistare',
        options: ['1', '2', '3', '4', '5']
      }
    ],
    inputElements: [
      {
        id: 'input-1',
        label: 'Codice coupon',
        description: 'Inserisci un codice coupon per ottenere uno sconto',
        placeholder: 'Inserisci il codice',
        type: 'text'
      },
      {
        id: 'input-2',
        label: 'Email',
        description: 'Inserisci la tua email per ricevere aggiornamenti sul tuo ordine',
        placeholder: 'esempio@email.com',
        type: 'email'
      }
    ]
  };

  // Crea l'URL con i dati di esempio
  const encodedData = encodeURIComponent(JSON.stringify(exampleData));
  const targetUrl = `/?actions=${encodedData}`;

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Pagina di test</h1>
      
      <div className="mb-8">
        <p className="mb-4">
          Questa pagina contiene un link di esempio per testare la funzionalità di visualizzazione delle azioni.
          Clicca sul pulsante qui sotto per vedere come verranno visualizzati gli elementi della pagina target.
        </p>
        
        <Link 
          href={targetUrl}
          className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Vai alla pagina con elementi di esempio
        </Link>
      </div>
      
      <div className="border-t pt-6">
        <h2 className="text-xl font-semibold mb-4">Dati di esempio:</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
          {JSON.stringify(exampleData, null, 2)}
        </pre>
      </div>
    </div>
  );
} 