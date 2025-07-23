"use client";

import { UserMessageProps } from "@copilotkit/react-ui";
import ResearchAssistant from "../components/Researcher";
import { Header } from "../components/Header";


import { CopilotChat } from "@copilotkit/react-ui";
import { User } from "lucide-react";

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


export default function CopilotKitPage() {

  
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <main className="flex-1 w-full">
        <ResearchAssistant />
        <CopilotChat
          instructions={"You are assisting the user as best as you can. Answer in the best way possible given the data you have."}
          labels={{
            title: "Causely",
            initial: "Hi! 👋 How can I assist you today?",
          }}
          className="h-full max-h-[740px] m-4 pb-4 bg-background overflow-hidden rounded-xl border border-border shadow-lg"
          UserMessage={CustomUserMessage}
        />
      </main>
    </div>
  );
}
