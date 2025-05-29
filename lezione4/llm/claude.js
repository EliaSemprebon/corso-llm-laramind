import { ChatAnthropic } from "@langchain/anthropic";

export function getModel(tools, apiKey) {
    const model = new ChatAnthropic({
        temperature: 0.5,
        model: "claude-3-5-sonnet-latest",
        anthropicApiKey: apiKey
    }).bindTools(tools, {
        parallelToolCalls: true
    });
    return model;
}