"use client";

import { Header } from "../components/Header";
import { CopilotChat } from "@copilotkit/react-ui";
import { useCoAgent } from "@copilotkit/react-core";
import { ResearchCanvas } from "../components/ResearchCanvas";

// const CustomUserMessage = (props: UserMessageProps) => {
//   // Use app's theme: primary color, rounded-xl, text-primary-foreground, bg-primary, etc.
//   const wrapperStyles = "flex items-center gap-2 justify-end mb-4";
//   const messageStyles =
//     "bg-primary text-primary-foreground py-2 px-4 rounded-xl break-words flex-shrink-0 max-w-[80%] shadow-sm border border-primary/20";
//   const avatarStyles =
//     "bg-primary/10 shadow-sm min-h-10 min-w-10 rounded-full text-primary flex items-center justify-center font-semibold text-lg";

//   return (
//     <div className={wrapperStyles}>
//       <div className={messageStyles}>{props.message}</div>
//       <div className={avatarStyles}>
//         <User className="h-4 w-4 text-primary" />
//       </div>
//     </div>
//   );
// };

type AgentState = {
  model: string;
  research_question: string;
  report: string;
  resources: Array<{ title: string; description: string; url: string }>;
  logs: Array<{ message: string; timestamp: string }>;
}

const model = "openai"
const agent = "research_agent"

export default function CopilotKitPage() {


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

  const shouldShowTwoColumns = true;

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

            onSubmitMessage={async () => {
              // clear the logs before starting the new research
              setState({ ...state, logs: [] });
              await new Promise((resolve) => setTimeout(resolve, 30));
            }} 
            className="h-full pb-4 bg-background overflow-hidden rounded-xl border border-border shadow-lg"
            //UserMessage={CustomUserMessage}
            // AssistantMessage={AssistantMessage}
          />
        </div>
        
        <div className={`transition-all duration-500 ease-in-out ${shouldShowTwoColumns ? 'h-full max-h-[740px] overflow-y-auto opacity-100' : 'h-0 opacity-0 overflow-hidden'}`}>
          {/* <ResearchAssistant /> */}
          <ResearchCanvas setActiveTab={() => {}} />
          {/* <ResearchAssistant /> */}

        </div>
      </main>
    </div>
  );
}
