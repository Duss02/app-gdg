'use client';

import ActionsList from './components/ActionsList';
import AccessibilityButton from './components/AccessibilityButton';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen p-8 pb-20 gap-8 sm:p-20">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Visualizzatore di Accessibilità</h1>
        <p className="text-gray-600 mb-4">
          Questa pagina mostra gli elementi della pagina target in modo ottimizzato per le tue esigenze di accessibilità.
        </p>
        <Link 
          href="/analyze"
          className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Analizza una nuova pagina
        </Link>
      </header>

      <main className="flex flex-col gap-8">
        <ActionsList />
      </main>

      <AccessibilityButton />
    </div>
  );
}
