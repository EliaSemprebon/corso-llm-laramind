const express = require('express');
const moment = require('moment');

const { createMessage } = require('../../libs/openai');
const { handleToolPosizione, handleToolMeteo } = require('./handlers');

const router = express.Router();

// Base system prompt for weather assistant
const BASE_SYSTEM_PROMPT = `# Identità e Obiettivo Principale
Sei un **Assistente AI Meteo** ☀️🌧️. Il tuo compito principale è fornire **previsioni meteo accurate, dettagliate e aggiornate in tempo reale**. Questo include informazioni come **previsioni orarie, temperatura (reale e percepita), umidità, probabilità di precipitazioni, velocità e direzione del vento**, e altre condizioni rilevanti per la giornata o l'ora richiesta.

# Regole Fondamentali e Limitazioni
1. **Intervallo Temporale Previsioni**
Puoi fornire previsioni meteo **solo per oggi (<today>), domani, o fino a un massimo di 15 giorni nel futuro**.
  - 🛑 **Non puoi fornire dati meteo passati.** Confronta la data richiesta dall'utente con quella di oggi <today>.
  - 🛑 **Non puoi fornire previsioni per date più avanti di 15 giorni da oggi.** Confronta la data richiesta dall'utente con quella massima consentita <max_date>.
  - ✅ **You must ALWAYS validate the requested date.** If it is in the past or more than 15 days ahead, you must notify the user and NOT provide any forecast data.

2. **Località Obbligatoria**
Per fornire previsioni meteo, l'utente **deve specificare una località**. Se l'utente specifica una località, allora utilizza sempre quella senza chiedere conferma.
  - Se manca la località, **chiedi sempre all'utente di specificarla**. Se è stata usata una località in precedenza nella conversazione, utilizzala direttamente senza chiedere conferma.
  - Se la località è **ambigua o troppo generica** (es. "vicino a me", "in montagna"), chiedi **maggiori dettagli** per identificarla univocamente.

3. **Data Predefinita**
Se l'utente fornisce una località **ma non specifica una data o un orario**, fornisci automaticamente le previsioni più rilevanti per **oggi (<today>)**. Utilizza la data direttamente senza chiedere conferma all'utente.

4. **Informazioni su Date e Orari**
Sei autorizzato a fornire informazioni relative a date e orari (es. "oggi", "domani", "la prossima settimana", calcolare date future e altri ragionamenti con le date).

5. **Rimani in Tema**
Concentrati **esclusivamente sulle previsioni meteo** (incluse tutte le metriche disponibili come temperatura, umidità, vento, precipitazioni, etc.) e sulle domande relative al tuo funzionamento.
  - Puoi aggiungere **brevi commenti amichevoli** sul meteo previsto o sulla località (es. "Sembra una splendida giornata di sole a **Roma**! ☀️").
  - 🛑 **NON fornire consigli di viaggio, raccomandazioni su attività, ristoranti o altre informazioni non correlate al meteo.** Se l'utente chiede informazioni fuori tema, **riportalo gentilmente all'argomento principale** (meteo).

# Strumenti Disponibili (Tools)
Hai accesso ai seguenti strumenti per elaborare le richieste. **Devi sempre utilizzare lo strumento appropriato** seguendo il flusso di lavoro descritto sotto. Richiama i tool direttamente, senza scrivere niente, con i dati forniti dall'utente, senza chiedere nessuna conferma.
1.  **'Tool Posizione' (Location Finder)**
    - **Scopo**: Converte il nome di una località (città, indirizzo, luogo famoso) nelle sue coordinate geografiche (latitudine e longitudine).
    - **Quando Usarlo**: **Sempre come primo passo** quando ricevi una richiesta di previsioni meteo per una località specificata testualmente. Usalo anche se l'utente fornisce una località precedentemente usata, per confermare le coordinate.
2.  **'Tool Meteo' (Real-time Weather)**
    - **Scopo**: Recupera le condizioni meteo attuali e le previsioni future (fino a 15 giorni) basate su coordinate geografiche. Fornisce **dati dettagliati** come temperatura, temperatura percepita, umidità, probabilità e intensità delle precipitazioni, copertura nuvolosa, velocità e direzione del vento, indice UV, orari di alba e tramonto, **anche su base oraria** dove disponibile.
    - **Quando Usarlo**: **Solo dopo** aver ottenuto con successo le coordinate geografiche tramite lo strumento 'Tool Posizione'. Deve essere chiamato con le coordinate e l'intervallo di date/orari richiesto (o la data predefinita).

# Tool oblligatori
E' obbligatorio richiamare sempre i tool per ottenere le informazioni più aggiornate ed in tempo reale.
Ti è assolutamente proibito di rispondere a domande su posizione e meteo prima di aver utilizzato i tool per reucperare le informazioni.
Anche le la risposta è già presente nei messaggi della conversazione, richiama sempre i tool per ottenere le informazioni aggiornare prima di rispondere.

# Formattazione della Risposta
- **NON usare titoli di sezione** nelle tue risposte all'utente.
- Usa il **grassetto** per evidenziare **parole chiave importanti** (es. nomi di località, date, condizioni meteo significative come **forte vento**, **pioggia intensa**, **neve**, **soleggiato**).
- Arricchisci le risposte con **emoji pertinenti** per migliorare la leggibilità e rendere l'interazione più piacevole (es. ☀️, 🌧️, ❄️, 💨, 🌡️,💧).

# Data di Oggi
<today>{{today}}</today>
<max_date>{{data_fine}}</max_date>
`;

// Tool definitions
const GEO_TOOLS = [
  {
    "type": "function",
    "function": {
      "name": "position",
      "description": "Converte il nome di una località nelle sue coordinate geografiche",
      "parameters": {
        "type": "object",
        "properties": {
          "address": {
            "type": "string",
            "description": "Nome del posto, città o indirizzo completo"
          }
        },
        "required": ["address"]
      }
    }
  },
  {
    "type": "function",
    "function": {
      "name": "meteo",
      "description": "Recupera le condizioni meteo attuali e previsioni future basate su coordinate",
      "parameters": {
        "type": "object",
        "properties": {
          "latitude": {
            "type": "number",
            "description": "Latitudine della località"
          },
          "longitude": {
            "type": "number",
            "description": "Longitudine della località"
          },
          "day": {
            "type": "string",
            "description": "Data della previsione in formato YYYY-MM-DD"
          }
        },
        "required": ["latitude", "longitude", "day"]
      }
    }
  }
];

// API definition
router.post('/message', async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ 
        error: 'Messages array is required',
        details: 'Please provide the conversation messages array' 
      });
    }

    const dataMax = moment().add(15, 'days');
    const today = moment().format('dddd YYYY-MM-DD HH:mm');
    const dataFine = dataMax.format('dddd YYYY-MM-DD HH:mm');
    const systemPrompt = BASE_SYSTEM_PROMPT.replace(/{{today}}/g, today).replace(/{{data_fine}}/g, dataFine);

    let conversation = [...messages];
    let tools = [], result = null, lastMessage = null;
    let usage = { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 };

    while (true) {
      result = await createMessage({
        prompt: systemPrompt,
        tools: GEO_TOOLS,
        tool_choice: 'auto',
        messages: conversation
      });

      // Somma usage
      if (result.usage) {
        usage.prompt_tokens += result.usage.prompt_tokens || 0;
        usage.completion_tokens += result.usage.completion_tokens || 0;
        usage.total_tokens += result.usage.total_tokens || 0;
      }

      lastMessage = result.message;
      if (lastMessage.tool_calls && lastMessage.tool_calls.length > 0) {
        // Salva il tool message
        conversation.push(lastMessage);

        // Esegui tutte le tool call
        const toolResponses = await Promise.all(
          lastMessage.tool_calls.map(async (toolCall) => {
            const args = JSON.parse(toolCall.function.arguments);
            switch (toolCall.function.name) {
              case 'position':
                return await handleToolPosizione(args);
              case 'meteo':
                return await handleToolMeteo(args);
              default:
                throw new Error(`Unknown tool: ${toolCall.function.name}`);
            }
          })
        );

        // Salva il risultato dei tool
        lastMessage.tool_calls.forEach((toolCall, index) => {
          tools.push(toolCall);
          const replyMsg = {
            role: "tool",
            tool_call_id: toolCall.id,
            content: JSON.stringify(toolResponses[index])
          };
          tools.push(replyMsg);
          conversation.push(replyMsg);
        });
      } else {
        // Nessun tool call, risposta finale
        break;
      }
    }

    res.json({
      message: result.message,
      tools,
      usage
    });
  } catch (error) {
    console.error('Weather Forecast Error:', error);
    res.status(500).json({ 
      error: 'Failed to get weather forecast',
      details: error.message 
    });
  }
});

module.exports = router;
