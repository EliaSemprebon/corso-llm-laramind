import { getModel as getOpenAIModel } from "./openai.js";
import { getModel as getClaudeModel } from "./claude.js";

function getModel(type, tools, apiKey) {
    switch (type) {
        case "openai":
            return getOpenAIModel(tools, apiKey);
        case "claude":
            return getClaudeModel(tools, apiKey);
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

export { getModel, createMessage };
