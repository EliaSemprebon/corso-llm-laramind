const { get_encoding } = require('tiktoken');
const crypto = require('crypto');

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

module.exports = {
    splitText,
    conTokens,
    getId
};
