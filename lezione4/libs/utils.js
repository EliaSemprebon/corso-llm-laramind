const { get_encoding } = require('tiktoken');
const crypto = require('crypto');
const { HumanMessage, SystemMessage, AIMessage, ToolMessage } = require('@langchain/core/messages');

/**
 * Splits a text into multiple parts using "---" as delimiter
 * @param {string} text - The text to split
 * @returns {string[]} Array of text parts
 */
function splitText(text) {
    if (!text) return [];
    return text.split('---').map(part => part.trim());
}

/**
 * Counts the number of tokens in a text using tiktoken
 * @param {string} content - The text to count tokens from
 * @returns {number} Number of tokens in the text
 */
function conTokens(content) {
    if (!content) return 0;
    const encoder = get_encoding('cl100k_base');
    const tokens = encoder.encode(content);
    encoder.free();
    return tokens.length;
}

/**
 * Generates a random 16-character hexadecimal ID using lowercase letters and numbers
 * @returns {string} Random hexadecimal ID
 */
function getId() {
    return crypto.randomBytes(8).toString('hex');
}

/**
 * Formats an array of categories into a markdown-formatted string for use in prompts
 * @param {Array<Object>} categories - Array of category objects
 * @param {string} categories[].name - The name of the category
 * @param {string|number} categories[].id - The unique identifier of the category
 * @param {string} categories[].summary - A brief description of the category
 * @returns {string} A markdown-formatted string containing category information
 */
function contextCategory(categories) {
    let categoriesText = "";
    for (const category of categories) {
      categoriesText += `- **${category.name}** (ID: ${category.id}): ${category.summary}\n`;
    }
    return categoriesText;
}

/**
 * Converts OpenAI-style messages to LangChain message format
 * @param {Array<Object>} messages - Array of message objects in OpenAI format
 * @param {string} systemPrompt - Optional system prompt to add if not present
 * @returns {Array} Array of LangChain message objects
 */
function convertToLangchainMessages(messages, systemPrompt = null) {
    const langchainMessages = messages.map(msg => {
        switch (msg.role) {
            case 'system':
                return new SystemMessage(msg.content);
            case 'user':
                return new HumanMessage(msg.content);
            case 'assistant':
                if (msg.tool_calls) {
                    return new AIMessage({
                        content: msg.content || '',
                        tool_calls: msg.tool_calls.map(tc => ({
                            name: tc.name,
                            args: tc.args,
                            id: tc.id,
                            type: tc.type || 'tool_call'
                        }))
                    });
                }
                return new AIMessage(msg.content);
            case 'tool':
                return new ToolMessage({
                    tool_call_id: msg.tool_call_id,
                    name: msg.name,
                    content: msg.content
                });
            default:
                return new HumanMessage(msg.content);
        }
    });

    // Add system prompt at the beginning if not already present and a prompt is provided
    if (systemPrompt && !messages.some(msg => msg.role === 'system')) {
        langchainMessages.unshift(new SystemMessage(systemPrompt));
    }

    return langchainMessages;
}

module.exports = {
    contextCategory,
    splitText,
    conTokens,
    getId,
    convertToLangchainMessages
};
