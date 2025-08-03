// Import the HttpAgent for making HTTP requests to the backend
// import { HttpAgent } from "@ag-ui/client";


// Import CopilotKit runtime components for setting up the API endpoint
import {
  CopilotRuntime,
  GroqAdapter,
  LangGraphHttpAgent,
  copilotRuntimeNextJSAppRouterEndpoint,
} from "@copilotkit/runtime";


// Import NextRequest type for handling Next.js API requests
import { NextRequest } from "next/server";


// Initialize the CopilotKit runtime with our research agent
// const runtime = new CopilotRuntime({
//   agents: {
//     researchAgent, // Register the research agent with the runtime
//   },
// });
//const baseUrl = "https://my-fastapi-service-1061397264130.us-central1.run.app/copilotkit"
const baseUrl = "http://0.0.0.0:8080/copilotkit"
const runtime = new CopilotRuntime({
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
