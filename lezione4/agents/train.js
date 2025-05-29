const { createMessage } = require('../llm/index.js');

const MASTER_PROMPT = `# Identità e Obiettivo Principale
Sei un **Esperto di Prenotazioni Ferroviarie** 🚂. Il tuo compito principale è assistere gli utenti nella ricerca e prenotazione di viaggi in treno, fornendo consigli personalizzati e gestendo l'intero processo di prenotazione in modo professionale ed efficiente.

# Competenze Principali
- Ricerca collegamenti ferroviari
- Gestione prenotazioni treni
- Consulenza su opzioni di viaggio
- Conoscenza della rete ferroviaria

# Regole Fondamentali

## 1. Gestione delle Richieste
- Analizza attentamente le richieste dell'utente per identificare:
  - Stazioni di partenza e arrivo
  - Date e orari di viaggio
  - Numero di passeggeri
  - Preferenze specifiche (classe, tipo treno, etc.)
- Procedi con la ricerca appropriata quando hai informazioni sufficienti
- Richiedi SOLO le informazioni mancanti essenziali

## 2. Processo di Prenotazione
Il processo si articola in due fasi principali:

### Fase 1: Ricerca Treni
- Utilizza il tool "cercaTreni" per trovare collegamenti disponibili
- Considera tutti i criteri specificati dall'utente
- Presenta le opzioni in modo chiaro e organizzato
- Evidenzia dettagli importanti come:
  - Orari e durata
  - Cambi e coincidenze
  - Classe e servizi
  - Tariffe e condizioni

### Fase 2: Prenotazione
- Utilizza il tool "prenotaTreno" per finalizzare la prenotazione
- Verifica tutti i dettagli prima di procedere
- Conferma la prenotazione all'utente

## 3. Precisione e Accuratezza
- Fornisci SEMPRE informazioni precise su:
  - Orari e durate dei viaggi
  - Tariffe e costi totali
  - Servizi a bordo
  - Regole di cambio/rimborso
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
- Inserisci emoji pertinenti per migliorare la leggibilità (🚂, 🎫, 🕒, 💺)

## Tono e Linguaggio
- Mantieni un tono professionale e preciso
- Usa terminologia del settore ferroviario
- Sii chiaro e conciso nelle spiegazioni
- Evita linguaggio promozionale esagerato

## Struttura della Risposta
- Inizia con un riassunto delle opzioni trovate
- Organizza le informazioni per rilevanza
- Evidenzia dettagli importanti (orari, prezzi)
- Concludi con i prossimi passi suggeriti`;

const TRAIN_TOOLS = {
  "cercaTreni": {
    "type": "function",
    "function": {
      "name": "cercaTreni",
      "description": "Cerca collegamenti ferroviari in base a criteri e preferenze specifiche",
      "parameters": {
        "type": "object",
        "properties": {
          "stazionePartenza": {
            "type": "string",
            "description": "Nome della stazione di partenza"
          },
          "stazioneArrivo": {
            "type": "string",
            "description": "Nome della stazione di arrivo"
          },
          "dataPartenza": {
            "type": "string",
            "description": "Data di partenza (formato YYYY-MM-DD)"
          },
          "orarioPartenza": {
            "type": "string",
            "description": "Orario di partenza desiderato (formato HH:MM)"
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
                "description": "Numero di bambini (4-11 anni)"
              },
              "neonati": {
                "type": "integer",
                "description": "Numero di neonati (0-3 anni)"
              }
            },
            "required": ["adulti"]
          },
          "classe": {
            "type": "string",
            "enum": ["standard", "premium", "business", "executive"],
            "description": "Classe di viaggio desiderata"
          },
          "filtri": {
            "type": "object",
            "properties": {
              "soloTreniDiretti": {
                "type": "boolean",
                "description": "Se true, cerca solo collegamenti diretti senza cambi"
              },
              "tipoTreno": {
                "type": "array",
                "items": {
                  "type": "string",
                  "enum": ["regionale", "intercity", "altavelocita"]
                },
                "description": "Tipologie di treno preferite"
              },
              "maxCambi": {
                "type": "integer",
                "description": "Numero massimo di cambi accettati"
              }
            }
          }
        },
        "required": ["stazionePartenza", "stazioneArrivo", "dataPartenza", "numeroPasseggeri"]
      }
    }
  },
  "prenotaTreno": {
    "type": "function",
    "function": {
      "name": "prenotaTreno",
      "description": "Effettua la prenotazione di un viaggio in treno",
      "parameters": {
        "type": "object",
        "properties": {
          "idTreno": {
            "type": "string",
            "description": "Identificativo univoco del treno/collegamento"
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
                }
              },
              "required": ["tipo", "nome", "cognome", "dataNascita"]
            }
          },
          "preferenzePosto": {
            "type": "object",
            "properties": {
              "posizione": {
                "type": "string",
                "enum": ["finestrino", "corridoio"],
                "description": "Preferenza posizione posto"
              },
              "direzione": {
                "type": "string",
                "enum": ["avanti", "indietro"],
                "description": "Preferenza direzione di marcia"
              },
              "carrozza": {
                "type": "string",
                "enum": ["silenziosa", "normale"],
                "description": "Preferenza tipo carrozza"
              }
            }
          },
          "servizi": {
            "type": "array",
            "items": {
              "type": "string",
              "enum": ["ristorazione", "assistenza_disabili"],
              "description": "Servizi aggiuntivi richiesti"
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
        "required": ["idTreno", "passeggeri", "contattoEmergenza"]
      }
    }
  }
};

// Tool execution functions
const executeTrainTools = {
  cercaTreni: () => {
    // Fixed JSON response for train search
    return {
      treni: [
        {
          id: "treno_1",
          tipo: "altavelocita",
          numero: "FR9514",
          stazionePartenza: "Roma Termini",
          stazioneArrivo: "Milano Centrale",
          dataPartenza: "2024-06-01",
          oraPartenza: "09:00",
          oraArrivo: "12:00",
          durata: "3h 00m",
          classe: "standard",
          prezzo: 89,
          postiDisponibili: 120,
          cambi: []
        },
        {
          id: "treno_2",
          tipo: "intercity",
          numero: "IC584",
          stazionePartenza: "Roma Termini",
          stazioneArrivo: "Firenze S.M.N.",
          dataPartenza: "2024-06-01",
          oraPartenza: "10:30",
          oraArrivo: "12:30",
          durata: "2h 00m",
          classe: "standard",
          prezzo: 45,
          postiDisponibili: 80,
          cambi: []
        },
        {
          id: "treno_3",
          tipo: "regionale",
          numero: "R2468",
          stazionePartenza: "Roma Termini",
          stazioneArrivo: "Napoli Centrale",
          dataPartenza: "2024-06-01",
          oraPartenza: "11:15",
          oraArrivo: "12:45",
          durata: "1h 30m",
          classe: "standard",
          prezzo: 25,
          postiDisponibili: 150,
          cambi: []
        }
      ]
    };
  },
  prenotaTreno: (params) => {
    // Dynamic JSON response that returns input parameters plus a confirmation
    return Object.assign({}, params, {
      statoPrenotazione: "confermata",
      numeroPrenotazione: "TRN" + Math.random().toString(36).substr(2, 9),
      messaggioConferma: "Prenotazione treno confermata con successo"
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
      tools: TRAIN_TOOLS
    });

    // Check if tool call is present
    if (response.message.tool_calls && response.message.tool_calls.length > 0) {
      const toolCall = response.message.tool_calls[0];
      const toolName = toolCall.function.name;
      const toolParams = JSON.parse(toolCall.function.arguments);

      // Execute tool and get result
      const toolResult = executeTrainTools[toolName](toolParams);

      // Get final response with tool result
      const finalResponse = await createMessage({
        model,
        prompt: MASTER_PROMPT,
        messages: [
          { role: "user", content: message },
          { role: "assistant", content: response.message.content },
          { role: "tool", content: JSON.stringify(toolResult) }
        ],
        tools: TRAIN_TOOLS
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
