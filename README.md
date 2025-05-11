# Visualizzatore di Accessibilità

Questa applicazione è progettata per migliorare l'accessibilità del web visualizzando siti web in modo ottimizzato per le esigenze degli utenti con disabilità come dislessia, daltonismo o problemi uditivi.

## Funzionalità

- **Onboarding personalizzato**: raccoglie informazioni sulle esigenze di accessibilità dell'utente (dislessia, daltonismo, sordità, ecc.)
- **Salvataggio delle preferenze**: memorizza le configurazioni dell'utente nel localStorage
- **Visualizzazione ottimizzata**: adatta l'interfaccia in base alle esigenze dell'utente
- **Ricezione di azioni esterne**: visualizza le azioni disponibili in una pagina target in modo accessibile

## Come utilizzare l'applicazione

1. **Configurazione iniziale**: naviga su `/onboarding` per impostare le tue preferenze di accessibilità
2. **Visualizzazione di un sito**: visita l'applicazione con un parametro `actions` nell'URL che contiene le informazioni sugli elementi del sito target

### Formato dei dati delle azioni

L'applicazione accetta le azioni sotto forma di parametro URL codificato con il seguente formato:

```json
{
  "clickElements": [
    {
      "id": "string o null se non disponibile",
      "label": "testo mostrato sull'elemento",
      "description": "breve descrizione di ciò che fa questo elemento"
    }
  ],
  "selectElements": [
    {
      "id": "string o null se non disponibile",
      "label": "testo associato a questo elemento di selezione",
      "description": "cosa controlla o influenza questa selezione",
      "options": ["opzione1", "opzione2", "opzione3"]
    }
  ],
  "inputElements": [
    {
      "id": "string o null se non disponibile",
      "label": "testo dell'etichetta del campo",
      "description": "quali informazioni raccoglie questo campo",
      "placeholder": "testo segnaposto se presente, altrimenti stringa vuota",
      "type": "text, number, email, o password"
    }
  ]
}
```

## Pagina di test

Per testare il funzionamento dell'applicazione, visitare la pagina `/test` che contiene un esempio di dati e un link per testare la visualizzazione ottimizzata.

## Tecnologie utilizzate

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS

## Sviluppo locale

Per avviare l'applicazione in modalità di sviluppo:

```bash
pnpm dev
```

Per costruire l'applicazione per la produzione:

```bash
pnpm build
```

Per avviare l'applicazione in modalità di produzione:

```bash
pnpm start
```
