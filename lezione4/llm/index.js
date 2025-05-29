const { getModel: getOpenAIModel } = require('./openai.js');
const { getModel: getClaudeModel } = require('./claude.js');

function getModel(type, tools) {
    switch (type) {
        case "openai":
            return getOpenAIModel(tools);
        case "claude":
            return getClaudeModel(tools);
        default:
            return null;
    }
}

async function createMessage({ model, prompt, messages }) {
  try {
    const response = await model.invoke([
      { role: "system", content: prompt },
      ...(messages || [])
    ]);
    return {
      message: response,
      usage: response.usage || {}
    };
  } catch (error) {
    console.error('Create Message API Error:', error);
    throw error;
  }
}

module.exports = { getModel, createMessage };
