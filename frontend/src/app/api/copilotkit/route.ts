// Import the HttpAgent for making HTTP requests to the backend
import { HttpAgent } from "@ag-ui/client";
import { Groq } from "groq-sdk";
import OpenAI from "openai";
 
const groq = new Groq({ apiKey: process.env["GROQ_API_KEY"] }); 

// Import CopilotKit runtime components for setting up the API endpoint
import {
  CopilotRuntime,
  GroqAdapter,
  LangGraphHttpAgent,
  OpenAIAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
} from "@copilotkit/runtime";


// Import NextRequest type for handling Next.js API requests
import { NextRequest } from "next/server";

// Create a new HttpAgent instance that connects to the LangGraph research backend running locally
const researchAgent = new HttpAgent({
  url: "http://0.0.0.0:8000/copilotkit/agents/research_agent",
});

// Initialize the CopilotKit runtime with our research agent
// const runtime = new CopilotRuntime({
//   agents: {
//     researchAgent, // Register the research agent with the runtime
//   },
// });

const baseUrl = "http://0.0.0.0:8080/copilotkit"
let runtime = new CopilotRuntime({
  agents: {
    'research_agent': new LangGraphHttpAgent({
      url: `${baseUrl}/agents/research_agent`,
    }),
  }
})
const llmAdapter = new GroqAdapter({  model: "deepseek-r1-distill-llama-70b" });
//  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
//  const llmAdapter = new OpenAIAdapter({ openai } as any);

/**
 * Define the POST handler for the API endpoint
 * This function handles incoming POST requests to the /api/copilotkit endpoint
 */
export const POST = async (req: NextRequest) => {
  // Configure the CopilotKit endpoint for the Next.js app router
  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime, // Use the runtime with our research agent
    serviceAdapter: llmAdapter, // Use the experimental adapter
    endpoint: "/api/copilotkit", // Define the API endpoint path
  });

  // Process the incoming request with the CopilotKit handler
  return handleRequest(req);
};
