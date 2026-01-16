import OpenAI from "openai";

let client: OpenAI | null = null;

function getClient(): OpenAI {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is missing at runtime");
  }

  if (!client) {
    client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  return client;
}

export async function estimateComplexityWithLLM(
  functionCode: string
): Promise<string> {
  const openai = getClient();

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content: `Return ONLY the Big-O time complexity of this function:\n\n${functionCode}`
      }
    ],
    temperature: 0
  });

  return response.choices[0].message.content?.trim() || "O(?)";
}
