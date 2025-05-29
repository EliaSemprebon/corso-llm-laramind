const { createMessage } = require('../../libs/openai.js');
const { MASTER_PROMPT, DOCUMENTATION_TOOL } = require('./prompts.js');
const { searchByCountry, searchByKeywords } = require('./handlers.js');

async function travelExpert(req, res) {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ 
        error: 'Messages array is required',
        details: 'Please provide the conversation messages array' 
      });
    }

    // Load the system prompt
    const systemPrompt = MASTER_PROMPT;

    let conversation = [...messages];
    let tools = [];
    let result = null;
    let lastMessage = null;
    let usage = { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 };
    let ragResults = [];

    while (true) {
      result = await createMessage({
        prompt: systemPrompt,
        tools: [DOCUMENTATION_TOOL],
        tool_choice: 'auto',
        messages: conversation
      });

      // Sum usage
      if (result.usage) {
        usage.prompt_tokens += result.usage.prompt_tokens || 0;
        usage.completion_tokens += result.usage.completion_tokens || 0;
        usage.total_tokens += result.usage.total_tokens || 0;
      }

      lastMessage = result.message;
      if (lastMessage.tool_calls && lastMessage.tool_calls.length > 0) {
        // Save the tool message
        conversation.push(lastMessage);

        // Process all tool calls
        for (const toolCall of lastMessage.tool_calls) {
          const args = JSON.parse(toolCall.function.arguments);
          tools.push(toolCall);
          
          let toolResponse = null;
          if (toolCall.function.name === 'cercaDocumentazioneViaggi') {
            // Extract parameters from the tool call
            const { tipoRicerca, paese, keywords } = args;
            
            if (tipoRicerca === 'paese') {
              // Nation-specific search using the handler
              ragResults = await searchByCountry(paese, keywords);
              // Save RAG results for return value
              if (ragResults && ragResults.length > 0) {
                const formattedResult = ragResults.map(doc => doc.pageContent).join('\n---\n');
                toolResponse = formattedResult;
              }
            } else if (tipoRicerca === 'interessi') {
              // Keyword-based search using the handler
              ragResults = await searchByKeywords(keywords);
              // Save RAG results for return value
              if (ragResults && ragResults.length > 0) {
                const formattedResult = ragResults.map(doc => doc.content).join('\n---\n');
                toolResponse = formattedResult;
              }
            } else {
              toolResponse = { error: `Invalid search type: ${tipoRicerca}` };
            }
          } else {
            toolResponse = { error: `Unknown tool: ${toolCall.function.name}` };
          }
          
          // Save the tool response
          const replyMsg = {
            role: "tool",
            tool_call_id: toolCall.id,
            content: JSON.stringify(toolResponse)
          };
          tools.push(replyMsg);
          conversation.push(replyMsg);
        }
      } else {
        // No more tool calls, final response
        break;
      }
    }

    return {
      message: result.message,
      tools,
      usage,
      ragResults
    };
  } catch (error) {
    console.error('Travel Expert Error:', error);
    throw error;
  }
}

module.exports = { travelExpert };
