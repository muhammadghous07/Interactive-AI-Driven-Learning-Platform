import { ChatGroq } from "@langchain/groq";

let conversationHistory = []; // To store the conversation history

export async function POST(request) {
  // WARNING: Do not expose your keys
  // WARNING: If you host publicly your project, add an authentication layer to limit the consumption of ChatGPT resources

  const body = await request.json();
  const { userInput } = body;

  const groq = new ChatGroq({
    model: "llama-3.3-70b-versatile",
    apiKey: "GROQ API KEY",
    maxTokens: 310,
    response_format: {
      type: "json_object",
    },
  });

  // Add the user's input to the conversation history
  conversationHistory.push({ role: "user", content: userInput });

  // Construct the conversation history as part of the prompt
  const history = conversationHistory
    .map((entry) => `${entry.role === "user" ? "User" : "AI"}: ${entry.content}`)
    .join("\n");

  const promptTemplate = `

      You are an AI specialist and must only answer questions directly related to artificial intelligence, including topics like machine learning, deep learning, natural language processing, algorithms, neural networks, AI ethics, and AI applications.

      If the user's question is NOT about AI, respond strictly with:
      "I'm here to answer questions related to AI. Please ask something about artificial intelligence."
      If the user's question is about AI, provide a detailed and informative answer, using examples where appropriate.
      Format your responses in a clean and structured way:
      - Use bullet points for lists.
      - Use \`code blocks\` for technical terms or code snippets.
      - Use line breaks (\n) to separate paragraphs.
      - Don't provide code
  Conversation History:
  ${history}
  
  Question: \n[Provide a situation or question here]\n
  Student's Answer: \n${userInput}\n

  `;


  const response = await groq.invoke(promptTemplate);

  // Add the AI's response to the conversation history
  conversationHistory.push({ role: "ai", content: response.content });

  console.log(response.content);
  return Response.json({ llmResponse: response.content }, { status: 200 });
}
