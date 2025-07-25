import { ResearchCanvas } from "./ResearchCanvas";
import { useCoAgent } from "@copilotkit/react-core";
import { CopilotChat } from "@copilotkit/react-ui";
import { useCopilotChatSuggestions } from "@copilotkit/react-ui";
import { Header } from "./Header";

type AgentState = {
  model: string;
  research_question: string;
  report: string;
  resources: any[];
  logs: any[];
}

const model = "openai"
const agent = "research_agent"

export default function Main() {
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


  useCopilotChatSuggestions({
    instructions: "NGOs in Delhi",
  });

  return (
    <>
    <Header />

      <div
        className="flex flex-1 border"
        style={{ height: "calc(100vh - 60px)" }}
      >
        <div
          className="w-[500px] h-full flex-shrink-0"
          style={
            {
              "--copilot-kit-background-color": "#F5F8FF",
              "--copilot-kit-secondary-color": "#0E103D",
              "--copilot-kit-separator-color": "#0E103D",
              "--copilot-kit-primary-color": "#009597",
              "--copilot-kit-contrast-color": "#FFFFFF",
              "--copilot-kit-secondary-contrast-color": "#000",
            } as any
          }
        >
          <CopilotChat
            className="h-full bg-background-primary text-primary"
            onSubmitMessage={async (message) => {
              // clear the logs before starting the new research
              setState({ ...state, logs: [] });
              await new Promise((resolve) => setTimeout(resolve, 30));
            }}
            labels={{
              initial: "Hi! How can I assist you with your research today?",
            }}
          />
        </div>
        <div className="flex-1 overflow-hidden">
          <ResearchCanvas />
        </div>
      </div>
    </>
  );
}