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
  charities: any[];
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
      charities: [],
    },
  });


  useCopilotChatSuggestions({
    instructions: "NGOs in Delhi",
  });

  const researchNotStarted = state.logs && 
                             state.report === "" && 
                             state.resources.length === 0 && 
                             state.charities.length === 0

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
              "--copilot-kit-background-color": "#E8E8E2",
              "--copilot-kit-secondary-color": "#0E103D",
              "--copilot-kit-separator-color": "#0E103D",
              "--copilot-kit-primary-color": "#009597",
              "--copilot-kit-contrast-color": "#FFFFFF",
              "--copilot-kit-secondary-contrast-color": "#000",
            } as any
          }
        >
          <CopilotChat
            className="h-full  bg-background-primary text-primary"
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
        {!researchNotStarted ? (
          <div className="flex-1 overflow-hidden">
            <ResearchCanvas />
          </div>
        ) : (
          <div className="flex-1 bg-[#FCFCF9] overflow-hidden flex items-center justify-center">
            <div className="text-center">
              <div className="flex flex-col items-center justify-center h-[50vh]">
                <h1 className="text-[6vw] font-bold text-primary mb-4 leading-tight">Causely</h1>
                <p className="text-[2vw]">
                  <span className="text-black">Smart Giving</span> <span className="text-primary">Made Simple.</span>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}