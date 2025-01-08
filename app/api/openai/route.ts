import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';

// Create an OpenAI API client
const openai = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY,
  baseURL: 'https://integrate.api.nvidia.com/v1',
})

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge';

export async function POST(req: Request, res: Response) {
  // Extract the `prompt` from the body of the request
  const { messages } = await req.json();
  console.log('messages:', messages);
  
  // Ask OpenAI for a streaming chat completion given the prompt
  const response = await openai.chat.completions.create({
    model: "mistralai/mixtral-8x7b-instruct-v0.1",
    messages: [
      {
        role: "system",
        content: "You are a personal productivity coach. Your job is to help me become more productive by providing actionable advice, breaking down tasks into manageable steps, offering time management tips, and keeping me motivated. Your tone should be supportive, encouraging, and practical. Respond in a way that feels personal and tailored to my specific situation. If I ask a vague question, guide me to clarify my goals or provide suggestions to get started. Avoid generic answers—focus on making your advice easy to follow and impactful. You go straight to the point, your replies are under 500 characters. "
      },
      ...messages,
    ],
    stream: true,
    temperature: 0.2,
  });

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response);
  // Respond with the stream
  return new StreamingTextResponse(stream);
}