"use client";

import {
  useCoAgent,
  useCoAgentStateRender,
} from "@copilotkit/react-core";
import { Progress } from "./Progress";
// import { EditResourceDialog } from "./EditResourceDialog";
// import { AddResourceDialog } from "./AddResourceDialog";
// import { Resources } from "./Resources";
import { Charities } from "./Charities";

type Resource = {
  url: string;
  title: string;
  description: string;
}

type Charity = {
  name: string;
  description: string;
  url: string;
}

type AgentState = {
  model: string;
  research_question: string;
  report: string;
  resources: Array<{ title: string; description: string; url: string }>;
  logs: Array<{ message: string; timestamp: string }>;
  charities: Charity[];
  }


const model = "openai"
const agent = "research_agent"

export function ResearchCanvas({setActiveTab}: {setActiveTab: (tab: string) => void} ) {

  const { state } = useCoAgent<AgentState>({
    name: agent,
    initialState: {
      model
    },
  });

  useCoAgentStateRender({
    name: agent,
    render: ({ state }) => {
      if (!state.logs || state.logs.length === 0) {
        return null;
      }
      return <Progress logs={state.logs} />;
    },
  });


  const resources: Resource[] = state.resources || [];

  return (
    <div className=" flex-1 overflow-hidden w-full h-full overflow-y-auto p-10 bg-[#FCFCF9]">
      <div className="space-y-8 pb-10 bg-[#FCFCF9]">
        {resources.length !== 0 && (<div className="mb-4">
            <Charities
              charities={resources}
              setActiveTab={setActiveTab}
            />
          </div>
        )}  
      </div>
    </div>
  );
}