"use client";

import { CopilotSidebar } from "@copilotkit/react-ui";
import ResearchAssistant from "../components/Researcher";
import { Header } from "../components/Header";


import { CopilotChat } from "@copilotkit/react-ui";


export default function CopilotKitPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6">
        {/* <ResearchAssistant /> */}
        <CopilotChat
      instructions={"You are assisting the user as best as you can. Answer in the best way possible given the data you have."}
      labels={{
        title: "Causely",
        initial: "Hi! 👋 How can I assist you today?",
      }}
    />
      </main>
    </div>
  );
}
