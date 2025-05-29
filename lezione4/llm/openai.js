import { ChatOpenAI } from "@langchain/openai";

export function getModel(tools, apiKey) {
    const model = new ChatOpenAI({
        temperature: 0.5,
        model: "gpt-4.1-mini",
        openAIApiKey: apiKey
    }).bindTools(tools, {
        parallel_tool_calls: true
    });
    return model;
}
