const { getModel, createMessage } = require('../llm/index.js');
const { handleMessage: handleHotelMessage } = require('../agents/hotels.js');
const { handleMessage: handleFlightMessage } = require('../agents/flight.js');
const { handleMessage: handleTrainMessage } = require('../agents/train.js');
const { MASTER_PROMPT, ORCHESTRATOR_TOOLS } = require('./prompt.js');


// Initialize OpenAI model
const model = getModel('openai', ORCHESTRATOR_TOOLS);

// Tool execution functions for specialized agents
const executeAgentTools = {
  agenteHotel: async (params) => {
    try {
      // Pass control to hotel agent and get response
      const response = await handleHotelMessage(model, params.message);
      return response;
    } catch (error) {
      console.error('Error in hotel agent:', error);
      return "Mi dispiace, si è verificato un errore con l'agente hotel.";
    }
  },
  agenteVoli: async (params) => {
    try {
      // Pass control to flight agent and get response
      const response = await handleFlightMessage(model, params.message);
      return response;
    } catch (error) {
      console.error('Error in flight agent:', error);
      return "Mi dispiace, si è verificato un errore con l'agente voli.";
    }
  },
  agenteTreni: async (params) => {
    try {
      // Pass control to train agent and get response
      const response = await handleTrainMessage(model, params.message);
      return response;
    } catch (error) {
      console.error('Error in train agent:', error);
      return "Mi dispiace, si è verificato un errore con l'agente treni.";
    }
  }
};

async function travelAgents(req, res) {
  try {
    const { message } = req.body;

    // Get initial response with tools
    const response = await createMessage({
      model,
      prompt: MASTER_PROMPT,
      messages: [{ role: "user", content: message }],
      tools: ORCHESTRATOR_TOOLS
    });

    // Check if tool call is present
    if (response.message.tool_calls && response.message.tool_calls.length > 0) {
      const toolCall = response.message.tool_calls[0];
      const toolName = toolCall.function.name;
      const toolParams = JSON.parse(toolCall.function.arguments);

      // Execute specialized agent and get result
      const agentResponse = await executeAgentTools[toolName](toolParams);

      // Get final response with agent result
      const finalResponse = await createMessage({
        model,
        prompt: MASTER_PROMPT,
        messages: [
          { role: "user", content: message },
          { role: "assistant", content: response.message.content },
          { role: "tool", content: agentResponse }
        ],
        tools: ORCHESTRATOR_TOOLS
      });

      return res.json({
        message: finalResponse.message.content
      });
    }

    return res.json({
      message: response.message.content
    });
  } catch (error) {
    console.error('Travel Agents Error:', error);
    return res.status(500).json({
      error: "Si è verificato un errore durante l'elaborazione della richiesta."
    });
  }
}

module.exports = { travelAgents };
