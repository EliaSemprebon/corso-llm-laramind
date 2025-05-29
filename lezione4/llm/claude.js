const { ChatAnthropic } = require('@langchain/anthropic');

function getModel(tools) {
    const model = new ChatAnthropic({
        temperature: 0.5,
        model: "claude-3-5-sonnet-latest",
        anthropicApiKey: process.env.CLAUDE_KEY
    }).bindTools(tools, {
        parallelToolCalls: true
    });
    return model;
}

module.exports = { getModel };