import { createMessage } from '../llm/index.js';

const MASTER_PROMPT = `# Identità e Obiettivo Principale
Sei un **Esperto di Prenotazioni Alberghiere** 🏨. Il tuo compito principale è assistere gli utenti nella ricerca e prenotazione di hotel, fornendo consigli personalizzati e gestendo l'intero processo di prenotazione in modo professionale ed efficiente.

# Competenze Principali
- Ricerca hotel in base a preferenze specifiche
- Gestione prenotazioni
- Consulenza personalizzata sulle sistemazioni

# Regole Fondamentali

## 1. Gestione delle Richieste
- Analizza attentamente le richieste dell'utente per identificare:
  - Destinazione desiderata
  - Date di soggiorno
  - Preferenze specifiche (budget, stelle, servizi, etc.)
  - Numero di ospiti
- Procedi con la ricerca appropriata quando hai informazioni sufficienti
- Richiedi SOLO le informazioni mancanti essenziali per la ricerca

## 2. Processo di Prenotazione
Il processo si articola in due fasi principali:

### Fase 1: Ricerca Iniziale
- Utilizza il tool "cercaHotel" per trovare strutture in base alle preferenze
- Considera tutti i criteri specificati dall'utente
- Presenta le opzioni in modo chiaro e organizzato

### Fase 2: Prenotazione
- Utilizza il tool "prenotaHotel" per finalizzare la prenotazione
- Verifica tutti i dettagli prima di procedere
- Conferma la prenotazione all'utente

## 3. Precisione e Accuratezza
- Fornisci SEMPRE informazioni precise su:
  - Tariffe e costi totali
  - Tipologie di camere disponibili
  - Servizi inclusi
- Non fare supposizioni su prezzi
- Verifica sempre i dettagli attraverso i tool appropriati

## 4. Limitazioni e Responsabilità
- Opera SOLO attraverso i tool forniti
- Non garantire tariffe senza verifica
- Spiega chiaramente termini e condizioni
- Non gestire dati di pagamento direttamente

# Processo di Risposta Strutturato

## Fase 1: Raccolta Informazioni
1. Analizza la richiesta dell'utente
2. Identifica le informazioni essenziali presenti
3. Richiedi SOLO i dettagli mancanti necessari

## Fase 2: Ricerca e Prenotazione
1. Esegui la ricerca con i criteri disponibili
2. Presenta le opzioni in modo organizzato
3. Procedi con la prenotazione se richiesto

# Stile delle Risposte

## Formattazione
- Usa il **grassetto** per evidenziare informazioni cruciali
- Utilizza elenchi puntati per caratteristiche e servizi
- Inserisci emoji pertinenti per migliorare la leggibilità (🏨, 🛏️, 🏊‍♂️, 🍽️)

## Tono e Linguaggio
- Mantieni un tono professionale e preciso
- Usa terminologia del settore alberghiero
- Sii chiaro e conciso nelle spiegazioni
- Evita linguaggio promozionale esagerato

## Struttura della Risposta
- Inizia con un riassunto delle opzioni trovate
- Organizza le informazioni per categoria
- Evidenzia dettagli importanti (prezzo)
- Concludi con i prossimi passi suggeriti`;

const HOTEL_TOOLS = {
  "cercaHotel": {
    "type": "function",
    "function": {
      "name": "cercaHotel",
      "description": "Cerca hotel in base a criteri e preferenze specifiche",
      "parameters": {
        "type": "object",
        "properties": {
          "destinazione": {
            "type": "string",
            "description": "Città o zona di interesse"
          },
          "dataCheckIn": {
            "type": "string",
            "description": "Data di check-in (formato YYYY-MM-DD)"
          },
          "dataCheckOut": {
            "type": "string",
            "description": "Data di check-out (formato YYYY-MM-DD)"
          },
          "numeroOspiti": {
            "type": "integer",
            "description": "Numero totale di ospiti"
          },
          "filtri": {
            "type": "object",
            "properties": {
              "stelle": {
                "type": "integer",
                "enum": [1, 2, 3, 4, 5],
                "description": "Numero di stelle dell'hotel"
              },
              "prezzoMassimo": {
                "type": "number",
                "description": "Prezzo massimo per notte"
              },
              "servizi": {
                "type": "array",
                "items": {
                  "type": "string",
                  "enum": ["piscina", "spa", "ristorante", "palestra", "wifi", "parcheggio"]
                },
                "description": "Servizi richiesti"
              }
            }
          }
        },
        "required": ["destinazione", "dataCheckIn", "dataCheckOut", "numeroOspiti"]
      }
    }
  },
  "prenotaHotel": {
    "type": "function",
    "function": {
      "name": "prenotaHotel",
      "description": "Effettua la prenotazione di un hotel",
      "parameters": {
        "type": "object",
        "properties": {
          "hotelId": {
            "type": "string",
            "description": "Identificativo univoco dell'hotel"
          },
          "dataCheckIn": {
            "type": "string",
            "description": "Data di check-in (formato YYYY-MM-DD)"
          },
          "dataCheckOut": {
            "type": "string",
            "description": "Data di check-out (formato YYYY-MM-DD)"
          },
          "numeroOspiti": {
            "type": "integer",
            "description": "Numero totale di ospiti"
          },
          "tipologiaCamera": {
            "type": "string",
            "enum": ["singola", "doppia", "tripla", "suite"],
            "description": "Tipologia di camera da prenotare"
          },
          "datiOspite": {
            "type": "object",
            "properties": {
              "nome": {
                "type": "string",
                "description": "Nome dell'ospite principale"
              },
              "cognome": {
                "type": "string",
                "description": "Cognome dell'ospite principale"
              },
              "email": {
                "type": "string",
                "description": "Email per la conferma della prenotazione"
              },
              "telefono": {
                "type": "string",
                "description": "Numero di telefono dell'ospite"
              }
            },
            "required": ["nome", "cognome", "email", "telefono"]
          }
        },
        "required": ["hotelId", "dataCheckIn", "dataCheckOut", "numeroOspiti", "tipologiaCamera", "datiOspite"]
      }
    }
  }
};

// Tool execution functions
const executeHotelTools = {
  cercaHotel: () => {
    // Fixed JSON response for hotel search
    return {
      hotels: [
        {
          id: "hotel_1",
          nome: "Grand Hotel Roma",
          stelle: 4,
          indirizzo: "Via Roma 1, Roma",
          prezzoPerNotte: 150,
          servizi: ["piscina", "spa", "ristorante", "wifi"],
          descrizione: "Elegante hotel nel centro di Roma"
        },
        {
          id: "hotel_2",
          nome: "Hotel Milano Centro",
          stelle: 3,
          indirizzo: "Via Milano 10, Milano",
          prezzoPerNotte: 120,
          servizi: ["ristorante", "wifi", "parcheggio"],
          descrizione: "Comodo hotel business nel cuore di Milano"
        },
        {
          id: "hotel_3",
          nome: "Venezia Palace",
          stelle: 5,
          indirizzo: "Canal Grande 5, Venezia",
          prezzoPerNotte: 300,
          servizi: ["spa", "ristorante", "wifi", "parcheggio"],
          descrizione: "Lussuoso palazzo storico sul Canal Grande"
        }
      ]
    };
  },
  prenotaHotel: (params) => {
    // Dynamic JSON response that returns input parameters plus a confirmation
    return Object.assign({}, params, {
      statoPrenotazione: "confermata",
      numeroPrenotazione: "PRE" + Math.random().toString(36).substr(2, 9),
      messaggioConferma: "Prenotazione confermata con successo"
    });
  }
};

// Message handling function
const handleMessage = async (model, message) => {
  try {
    // Get initial response with tools
    const response = await createMessage({
      model,
      prompt: MASTER_PROMPT,
      messages: [{ role: "user", content: message }],
      tools: HOTEL_TOOLS
    });

    // Check if tool call is present
    if (response.message.tool_calls && response.message.tool_calls.length > 0) {
      const toolCall = response.message.tool_calls[0];
      const toolName = toolCall.function.name;
      const toolParams = JSON.parse(toolCall.function.arguments);

      // Execute tool and get result
      const toolResult = executeHotelTools[toolName](toolParams);

      // Get final response with tool result
      const finalResponse = await createMessage({
        model,
        prompt: MASTER_PROMPT,
        messages: [
          { role: "user", content: message },
          { role: "assistant", content: response.message.content },
          { role: "tool", content: JSON.stringify(toolResult) }
        ],
        tools: HOTEL_TOOLS
      });

      return finalResponse.message.content;
    }

    return response.message.content;
  } catch (error) {
    console.error('Error in handleMessage:', error);
    return "Mi dispiace, si è verificato un errore durante l'elaborazione della richiesta.";
  }
};

export {
  MASTER_PROMPT,
  HOTEL_TOOLS,
  handleMessage
};
