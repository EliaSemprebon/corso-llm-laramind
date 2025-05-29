const { createMessage } = require('../llm/index.js');

const MASTER_PROMPT = `# Identità e Obiettivo Principale
Sei un **Esperto di Prenotazioni Voli** ✈️. Il tuo compito principale è assistere gli utenti nella ricerca e prenotazione di voli, fornendo consigli personalizzati e gestendo l'intero processo di prenotazione in modo professionale ed efficiente.

# Competenze Principali
- Ricerca voli in base a preferenze specifiche
- Gestione prenotazioni aeree
- Consulenza su opzioni di viaggio
- Conoscenza delle compagnie aeree e delle rotte

# Regole Fondamentali

## 1. Gestione delle Richieste
- Analizza attentamente le richieste dell'utente per identificare:
  - Aeroporti di partenza e arrivo
  - Date di viaggio
  - Numero di passeggeri
  - Preferenze specifiche (classe, compagnia aerea, etc.)
- Procedi con la ricerca appropriata quando hai informazioni sufficienti
- Richiedi SOLO le informazioni mancanti essenziali

## 2. Processo di Prenotazione
Il processo si articola in due fasi principali:

### Fase 1: Ricerca Voli
- Utilizza il tool "cercaVoli" per trovare opzioni disponibili
- Considera tutti i criteri specificati dall'utente
- Presenta le opzioni in modo chiaro e organizzato
- Evidenzia dettagli importanti come:
  - Orari e durata
  - Scali e coincidenze
  - Classe e servizi
  - Tariffe e condizioni

### Fase 2: Prenotazione
- Utilizza il tool "prenotaVolo" per finalizzare la prenotazione
- Verifica tutti i dettagli prima di procedere
- Conferma la prenotazione all'utente

## 3. Precisione e Accuratezza
- Fornisci SEMPRE informazioni precise su:
  - Orari e durate dei voli
  - Tariffe e costi totali
  - Politiche bagaglio
  - Regole di cambio/cancellazione
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

## Fase 2: Ricerca e Presentazione
1. Esegui la ricerca con i criteri disponibili
2. Presenta le opzioni in modo organizzato
3. Evidenzia caratteristiche rilevanti per l'utente

# Stile delle Risposte

## Formattazione
- Usa il **grassetto** per evidenziare informazioni cruciali
- Utilizza elenchi puntati per caratteristiche e opzioni
- Inserisci emoji pertinenti per migliorare la leggibilità (✈️, 🛄, 🕒, 💺)

## Tono e Linguaggio
- Mantieni un tono professionale e preciso
- Usa terminologia del settore aereo
- Sii chiaro e conciso nelle spiegazioni
- Evita linguaggio promozionale esagerato

## Struttura della Risposta
- Inizia con un riassunto delle opzioni trovate
- Organizza le informazioni per rilevanza
- Evidenzia dettagli importanti (orari, prezzi)
- Concludi con i prossimi passi suggeriti`;

const FLIGHT_TOOLS = {
  "cercaVoli": {
    "type": "function",
    "function": {
      "name": "cercaVoli",
      "description": "Cerca voli disponibili in base a criteri e preferenze specifiche",
      "parameters": {
        "type": "object",
        "properties": {
          "aeroportoPartenza": {
            "type": "string",
            "description": "Codice IATA dell'aeroporto di partenza"
          },
          "aeroportoArrivo": {
            "type": "string",
            "description": "Codice IATA dell'aeroporto di arrivo"
          },
          "dataPartenza": {
            "type": "string",
            "description": "Data di partenza (formato YYYY-MM-DD)"
          },
          "dataRitorno": {
            "type": "string",
            "description": "Data di ritorno per voli andata/ritorno (formato YYYY-MM-DD)"
          },
          "numeroPasseggeri": {
            "type": "object",
            "properties": {
              "adulti": {
                "type": "integer",
                "description": "Numero di passeggeri adulti"
              },
              "bambini": {
                "type": "integer",
                "description": "Numero di bambini (2-11 anni)"
              },
              "neonati": {
                "type": "integer",
                "description": "Numero di neonati (0-2 anni)"
              }
            },
            "required": ["adulti"]
          },
          "classe": {
            "type": "string",
            "enum": ["economy", "premium_economy", "business", "first"],
            "description": "Classe di viaggio desiderata"
          },
          "filtri": {
            "type": "object",
            "properties": {
              "soloVoliDiretti": {
                "type": "boolean",
                "description": "Se true, cerca solo voli diretti senza scali"
              },
              "compagnieAeree": {
                "type": "array",
                "items": {
                  "type": "string"
                },
                "description": "Lista di codici IATA delle compagnie aeree preferite"
              },
              "orarioPartenzaDopo": {
                "type": "string",
                "description": "Orario minimo di partenza (formato HH:MM)"
              },
              "orarioPartenzaPrima": {
                "type": "string",
                "description": "Orario massimo di partenza (formato HH:MM)"
              }
            }
          }
        },
        "required": ["aeroportoPartenza", "aeroportoArrivo", "dataPartenza", "numeroPasseggeri"]
      }
    }
  },
  "prenotaVolo": {
    "type": "function",
    "function": {
      "name": "prenotaVolo",
      "description": "Effettua la prenotazione di un volo",
      "parameters": {
        "type": "object",
        "properties": {
          "idVolo": {
            "type": "string",
            "description": "Identificativo univoco del volo"
          },
          "passeggeri": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "tipo": {
                  "type": "string",
                  "enum": ["adulto", "bambino", "neonato"],
                  "description": "Tipologia di passeggero"
                },
                "nome": {
                  "type": "string",
                  "description": "Nome del passeggero"
                },
                "cognome": {
                  "type": "string",
                  "description": "Cognome del passeggero"
                },
                "dataNascita": {
                  "type": "string",
                  "description": "Data di nascita (formato YYYY-MM-DD)"
                },
                "documento": {
                  "type": "object",
                  "properties": {
                    "tipo": {
                      "type": "string",
                      "enum": ["passaporto", "carta_identita"],
                      "description": "Tipo di documento"
                    },
                    "numero": {
                      "type": "string",
                      "description": "Numero del documento"
                    },
                    "dataScadenza": {
                      "type": "string",
                      "description": "Data di scadenza del documento (formato YYYY-MM-DD)"
                    }
                  },
                  "required": ["tipo", "numero", "dataScadenza"]
                }
              },
              "required": ["tipo", "nome", "cognome", "dataNascita", "documento"]
            }
          },
          "bagaglio": {
            "type": "object",
            "properties": {
              "bagaglioStiva": {
                "type": "integer",
                "description": "Numero di bagagli da stiva"
              },
              "pesoBagaglioStiva": {
                "type": "integer",
                "description": "Peso per bagaglio da stiva in kg"
              }
            }
          },
          "preferenzePosto": {
            "type": "array",
            "items": {
              "type": "string",
              "enum": ["finestrino", "corridoio", "centrale", "uscita_emergenza"],
              "description": "Preferenze per il posto"
            }
          },
          "contattoEmergenza": {
            "type": "object",
            "properties": {
              "nome": {
                "type": "string",
                "description": "Nome del contatto di emergenza"
              },
              "telefono": {
                "type": "string",
                "description": "Numero di telefono del contatto di emergenza"
              }
            },
            "required": ["nome", "telefono"]
          }
        },
        "required": ["idVolo", "passeggeri", "contattoEmergenza"]
      }
    }
  }
};

// Tool execution functions
const executeFlightTools = {
  cercaVoli: () => {
    // Fixed JSON response for flight search
    return {
      voli: [
        {
          id: "volo_1",
          compagniaAerea: "Alitalia",
          numeroVolo: "AZ1234",
          aeroportoPartenza: "FCO",
          aeroportoArrivo: "LIN",
          dataPartenza: "2024-06-01",
          oraPartenza: "10:00",
          oraArrivo: "11:15",
          durata: "1h 15m",
          classe: "economy",
          prezzo: 120,
          postiDisponibili: 45,
          scali: []
        },
        {
          id: "volo_2",
          compagniaAerea: "ITA Airways",
          numeroVolo: "AZ456",
          aeroportoPartenza: "FCO",
          aeroportoArrivo: "CDG",
          dataPartenza: "2024-06-01",
          oraPartenza: "14:30",
          oraArrivo: "16:45",
          durata: "2h 15m",
          classe: "business",
          prezzo: 350,
          postiDisponibili: 15,
          scali: []
        },
        {
          id: "volo_3",
          compagniaAerea: "Lufthansa",
          numeroVolo: "LH1234",
          aeroportoPartenza: "MXP",
          aeroportoArrivo: "FRA",
          dataPartenza: "2024-06-01",
          oraPartenza: "07:15",
          oraArrivo: "08:45",
          durata: "1h 30m",
          classe: "economy",
          prezzo: 180,
          postiDisponibili: 25,
          scali: []
        }
      ]
    };
  },
  prenotaVolo: (params) => {
    // Dynamic JSON response that returns input parameters plus a confirmation
    return Object.assign({}, params, {
      statoPrenotazione: "confermata",
      numeroPrenotazione: "FLT" + Math.random().toString(36).substr(2, 9),
      messaggioConferma: "Prenotazione volo confermata con successo"
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
      tools: FLIGHT_TOOLS
    });

    // Check if tool call is present
    if (response.message.tool_calls && response.message.tool_calls.length > 0) {
      const toolCall = response.message.tool_calls[0];
      const toolName = toolCall.function.name;
      const toolParams = JSON.parse(toolCall.function.arguments);

      // Execute tool and get result
      const toolResult = executeFlightTools[toolName](toolParams);

      // Get final response with tool result
      const finalResponse = await createMessage({
        model,
        prompt: MASTER_PROMPT,
        messages: [
          { role: "user", content: message },
          { role: "assistant", content: response.message.content },
          { role: "tool", content: JSON.stringify(toolResult) }
        ],
        tools: FLIGHT_TOOLS
      });

      return finalResponse.message.content;
    }

    return response.message.content;
  } catch (error) {
    console.error('Error in handleMessage:', error);
    return "Mi dispiace, si è verificato un errore durante l'elaborazione della richiesta.";
  }
};

module.exports = {
  handleMessage
};
