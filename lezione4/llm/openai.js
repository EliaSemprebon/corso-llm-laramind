const { ChatOpenAI } = require('@langchain/openai');

function getModel(tools) {
    const model = new ChatOpenAI({
        temperature: 0.5,
        model: "gpt-4.1-mini",
        openAIApiKey: process.env.OPENAI_API_KEY
    }).bindTools(tools, {
        parallel_tool_calls: true
    });
    return model;
}

module.exports = { getModel };
