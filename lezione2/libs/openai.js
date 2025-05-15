const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function createMessage({ prompt, tools, tool_choice, messages }) {
  try {
    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: prompt },
        ...(messages || [])
      ],
      tools: tools || [],
      model: "gpt-4.1-mini",
      tool_choice: tool_choice || "auto"
    });
    const response = completion.choices[0].message;
    const { prompt_tokens, completion_tokens, total_tokens } = completion.usage;
    return {
      message: response,
      usage: {
        prompt_tokens,
        completion_tokens,
        total_tokens
      }
    };
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw error;
  }
}

module.exports = {
  createMessage
}
