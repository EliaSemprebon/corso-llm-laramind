const { ChatGoogleGenerativeAI } = require('@langchain/google-genai');
const { convertToLangchainMessages } = require('./utils');

// Initialize the model
const chatModel = new ChatGoogleGenerativeAI({
  modelName: 'gemini-pro',
  temperature: 0
});

async function createMessage({ prompt, tools, tool_choice, messages }) {
  try {
    // Convert messages to LangChain format
    const langchainMessages = convertToLangchainMessages(messages, prompt);

    // Call the model
    const response = await chatModel.invoke(langchainMessages, {
      tools: tools || [],
      tool_choice: tool_choice || 'auto'
    });

    // Format response to match original structure
    const formattedResponse = {
      message: {
        role: 'assistant',
        content: response.content,
        tool_calls: response.additional_kwargs?.tool_calls
      },
      usage: response.usage_metadata || {
        prompt_tokens: 0,
        completion_tokens: 0,
        total_tokens: 0
      }
    };

    return formattedResponse;
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw error;
  }
}

module.exports = {
  createMessage
};
