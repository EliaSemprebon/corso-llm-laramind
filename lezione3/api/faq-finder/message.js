const path = require('path');
const fs = require('fs/promises');

const utils = require('../../libs/utils.js');
const chroma = require('../../libs/chroma.js');
const { createMessage } = require('../../libs/openai.js');
const { MASTER_PROMPT, DOCUMENTATION_TOOL } = require('./prompts.js');

async function faqFinder(req, res) {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ 
        error: 'Messages array is required',
        details: 'Please provide the conversation messages array' 
      });
    }

    // Load categories for the prompt
    const categoriesPath = path.join(process.cwd(), 'docs', 'faqs', 'categories.json');
    const categories = JSON.parse(await fs.readFile(categoriesPath, 'utf8'));
    const categoriesText = utils.contextCategory(categories);
    
    // Replace the {{categories}} placeholder with the formatted categories
    const systemPrompt = MASTER_PROMPT.replace('{{categories}}', categoriesText);

    let conversation = [...messages];
    let tools = [];
    let result = null;
    let lastMessage = null;
    let usage = { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 };

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
          if (toolCall.function.name === 'cercaFAQ') {
            // Extract query and categories from the tool call
            const { queries, categories } = args;
            
            // Prepare where clause for ChromaDB
            const where = { project: 'faq-finder' };
            if (categories && categories.length > 0) {
              where.categoryId = { $in: categories.map(id => id.toString()) };
            }
            
            // Search in ChromaDB
            const results = await chroma.read(queries, where);
            toolResponse = results || [];
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
      usage
    };
  } catch (error) {
    console.error('FAQ Finder Error:', error);
    throw error;
  }
}

module.exports = { faqFinder };
