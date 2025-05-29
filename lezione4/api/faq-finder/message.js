const path = require('path');
const fs = require('fs/promises');

const utils = require('../../libs/utils.js');
const openaiLib = require('../../libs/openai.js');
const claudeLib = require('../../libs/claude.js');

// Select the appropriate LLM library
const LLM = 'openai'; // Can be 'openai' or 'claude'
const { createMessage } = LLM === 'claude' ? claudeLib : openaiLib;
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
    let usage = { input_tokens: 0, output_tokens: 0, total_tokens: 0 };
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
        usage.input_tokens += result.usage.input_tokens || 0;
        usage.output_tokens += result.usage.output_tokens || 0;
        usage.total_tokens += result.usage.total_tokens || 0;
      }

      lastMessage = result.message;
      if (lastMessage.tool_calls && lastMessage.tool_calls.length > 0) {
        // Save the tool message
        conversation.push(lastMessage);

        // Process all tool calls
        for (const toolCall of lastMessage.tool_calls) {
          const args = toolCall.args;
          tools.push(toolCall);
          
          let toolResponse = null;
          if (toolCall.name === 'cercaFAQ') {
            // Execute the LangChain tool
            toolResponse = await DOCUMENTATION_TOOL.invoke(args);
          } else {
            toolResponse = { error: `Unknown tool: ${toolCall.name}` };
          }
          
          // Save the tool response
          const replyMsg = {
            role: "tool",
            name: toolCall.name,
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
    //console.error('FAQ Finder Error:', error);
    throw error;
  }
}

module.exports = { faqFinder };
