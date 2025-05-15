const express = require('express');
const { createMessage } = require('../../libs/openai');

const router = express.Router();

// Base system prompt for semantic analysis
const BASE_SYSTEM_PROMPT = `Sei un assistente linguistico.

Analizza il testo che ricevi come variabile {{content}}. Non rispondere direttamente. 
Compila i parametri necessari per il tool "analizzaEstratto" in base al testo. 

Individua:
- Il tono generale (scegli tra: formale, informale, ironico, drammatico, neutro)
- La lingua in cui è scritto il testo
- Una lista di argomenti rilevanti (parole chiave o concetti)
- Se si tratta o no di un testo a carattere scientifico`;

// Tool definition for semantic analysis
const SEMANTIC_TOOLS = [
  {
    "type": "function",
    "function": {
      "name": "analizzaEstratto",
      "description": "Analizza un testo per identificare tono, lingua, argomenti e se è un testo scientifico.",
      "parameters": {
        "type": "object",
        "properties": {
          "tono": {
            "type": "string",
            "enum": ["formale", "informale", "ironico", "drammatico", "neutro"],
            "description": "Il tono predominante del testo."
          },
          "lingua": {
            "type": "string",
            "description": "La lingua in cui è scritto il testo."
          },
          "argomenti": {
            "type": "array",
            "items": {
              "type": "string",
              "description": "Tema o concetto rilevante"
            },
            "description": "Temi o concetti principali del testo."
          },
          "scientifico": {
            "type": "boolean",
            "description": "Indica se il testo è di carattere scientifico."
          }
        },
        "required": ["tono", "lingua", "argomenti", "scientifico"]
      }
    }
  }
];

// API definition
router.post('/message', async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ 
        error: 'Content is required',
        details: 'Please provide the text content to analyze' 
      });
    }

    const systemPrompt = BASE_SYSTEM_PROMPT.replace('{{content}}', content);

    const result = await createMessage({
      prompt: systemPrompt,
      tools: SEMANTIC_TOOLS,
      tool_choice: 'required',
      messages: [{ role: "user", content }]
    });

    res.json(result);
  } catch (error) {
    console.error('Semantic Analysis Error:', error);
    res.status(500).json({ 
      error: 'Failed to analyze text',
      details: error.message 
    });
  }
});

module.exports = router;
