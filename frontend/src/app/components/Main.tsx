import { ResearchCanvas } from "./ResearchCanvas";
import { useCoAgent } from "@copilotkit/react-core";
import { CopilotChat } from "@copilotkit/react-ui";
import { useCopilotChatSuggestions } from "@copilotkit/react-ui";
import { Header } from "./Header";
import React, { useEffect } from "react";
import CharitiesTab from "./CharitiesTab";

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

const DefaultCanvas = () => {
  return (
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
  )
}



export default function Main() {

  const [tabs, setTabs] = React.useState(["Recommendation", "Charities", "Report"])
  const [activeTab, setActiveTab] = React.useState("Recommendation")

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
    instructions: "NGOs working for children education",
  });

  const researchNotStarted = state.logs &&
    state.report === "" &&
    state.resources.length === 0 &&
    state.charities.length === 0

  
  const charities = state.charities  

  console.log("STATE", state)

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
            onSubmitMessage={async () => {
              // clear the logs before starting the new research
              setState({ ...state, logs: [] });
              await new Promise((resolve) => setTimeout(resolve, 30));
            }}
            labels={{
              initial: "Hi! How can I assist you with your research today?",
            }}
          />
        </div>

        {researchNotStarted ? <DefaultCanvas /> :<div className="flex-1 flex flex-col">
          {/* Tab Navigation */}
          <div className="flex border-b bg-white">
            {tabs.map((tab) => (
              <div
                key={tab}
                className={`px-4 py-2 cursor-pointer border-b-2 transition-colors ${activeTab === tab
                    ? "border-primary text-primary bg-gray-50"
                    : "border-transparent text-gray-600 hover:text-gray-800"
                  }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </div>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-hidden">
            {activeTab === "Recommendation" && 
              <ResearchCanvas 
                setActiveTab={setActiveTab} 
              />
            }

            {activeTab === "Charities" && (
              <CharitiesTab charities={charities} />
            )}
            {/* {activeTab === "Report" && (
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-4">Report</h2>
                {state.report ? (
                  <div className="prose max-w-none">
                    <pre className="whitespace-pre-wrap">{state.report}</pre>
                  </div>
                ) : (
                  <p className="text-gray-500">No report generated yet.</p>
                )}
              </div>
            )} */}
          </div>
        </div>}
      </div>
    </>
  );
}