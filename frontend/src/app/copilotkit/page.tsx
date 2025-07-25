"use client";

import { useCopilotChatSuggestions, UserMessageProps } from "@copilotkit/react-ui";
import ResearchAssistant from "../components/Researcher";
import { Header } from "../components/Header";
import { CopilotChat } from "@copilotkit/react-ui";
import { User } from "lucide-react";
import { AssistantMessage } from "../components/AssistantChat";
import { useState, useEffect } from "react";
import { useCoAgent } from "@copilotkit/react-core";
import { ResearchAgentState } from "@/lib/types";
import { ResearchCanvas } from "../components/ResearchCanvas";

const CustomUserMessage = (props: UserMessageProps) => {
  // Use app's theme: primary color, rounded-xl, text-primary-foreground, bg-primary, etc.
  const wrapperStyles = "flex items-center gap-2 justify-end mb-4";
  const messageStyles =
    "bg-primary text-primary-foreground py-2 px-4 rounded-xl break-words flex-shrink-0 max-w-[80%] shadow-sm border border-primary/20";
  const avatarStyles =
    "bg-primary/10 shadow-sm min-h-10 min-w-10 rounded-full text-primary flex items-center justify-center font-semibold text-lg";

  return (
    <div className={wrapperStyles}>
      <div className={messageStyles}>{props.message}</div>
      <div className={avatarStyles}>
        <User className="h-4 w-4 text-primary" />
      </div>
    </div>
  );
};

type AgentState = {
  model: string;
  research_question: string;
  report: string;
  resources: any[];
  logs: any[];
}

const model = "google_genai"
const agent = "research_agent"

export default function CopilotKitPage() {
  
  // Connect to the research agent state
  const { state: researchState } = useCoAgent<ResearchAgentState>({
    name: "researchAgent",
  });


  const { state, setState } = useCoAgent<AgentState>({
    name: agent,
    initialState: {
      model,
      research_question: "",
      resources: [],
      report: "",
      logs: [],
    },
  });

  // useCopilotChatSuggestions({
  //   instructions: "Lifespan of penguins",
  // });

  console.log("State", state);

  const isResearchCompleted = researchState?.research?.stage === "report_complete";
  const shouldShowTwoColumns = isResearchCompleted;

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <main className={`flex-1 w-full p-4 transition-all duration-500 ease-in-out ${shouldShowTwoColumns ? 'grid grid-cols-1 lg:grid-cols-2 gap-4' : 'flex'}`}>
        <div className={`transition-all duration-500 ease-in-out ${shouldShowTwoColumns ? 'h-full max-h-[740px]' : 'w-full h-full'}`}>
          <CopilotChat
            instructions={"You are assisting the user as best as you can. Answer in the best way possible given the data you have."}
            labels={{
              title: "Causely",
              initial: "Hi! 👋 How can I assist you today?",
            }}

            onSubmitMessage={async (message) => {
              // clear the logs before starting the new research
              setState({ ...state, logs: [] });
              await new Promise((resolve) => setTimeout(resolve, 30));
            }} 
            className="h-full pb-4 bg-background overflow-hidden rounded-xl border border-border shadow-lg"
            UserMessage={CustomUserMessage}
            // AssistantMessage={AssistantMessage}
          />
        </div>
        
        <div className={`transition-all duration-500 ease-in-out ${shouldShowTwoColumns ? 'h-full max-h-[740px] overflow-y-auto opacity-100' : 'h-0 opacity-0 overflow-hidden'}`}>
          {/* <ResearchAssistant /> */}
          <ResearchCanvas />
          {/* <ResearchAssistant /> */}

        </div>
      </main>
    </div>
  );
}
