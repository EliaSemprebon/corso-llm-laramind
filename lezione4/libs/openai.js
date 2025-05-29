const { OpenAIEmbeddings } = require('@langchain/openai');
const { ChatOpenAI } = require('@langchain/openai');
const { convertToLangchainMessages } = require('./utils');

// Initialize the models
const chatModel = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  modelName: "gpt-4.1-mini",
  temperature: 0
});

const embeddings = new OpenAIEmbeddings({
  modelName: "text-embedding-3-large"
});

async function createEmbedding(content) {
  try {
    const input = Array.isArray(content) ? content : [content];
    const embeddings_array = await embeddings.embedDocuments(input);
    return embeddings_array;
  } catch (error) {
    console.error('OpenAI Embedding Error:', error);
    throw error;
  }
}

async function createMessage({ prompt, tools, tool_choice, messages }) {
  try {
    // Convert messages to LangChain format using the utility function
    const langchainMessages = convertToLangchainMessages(messages, prompt);

    // Call the model
    const response = await chatModel.invoke(langchainMessages, {
      tools: tools || [],
      tool_choice: tool_choice || "auto"
    });

    // Format response to match original structure
    const formattedResponse = {
      message: {
        role: 'assistant',
        content: response.content,
        tool_calls: response.tool_calls
      },
      usage: response.usage_metadata || {
        prompt_tokens: 0,
        completion_tokens: 0,
        total_tokens: 0
      }
    };

    return formattedResponse;
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw error;
  }
}

module.exports = {
  createMessage,
  createEmbedding
};
