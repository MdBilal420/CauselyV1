"use client";

import { useState } from "react";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
  useCoAgent,
  useCoAgentStateRender,
  useCopilotAction,
} from "@copilotkit/react-core";
import { Progress } from "./Progress";
// import { EditResourceDialog } from "./EditResourceDialog";
// import { AddResourceDialog } from "./AddResourceDialog";
import { Resources } from "./Resources";

type Resource = {
  url: string;
  title: string;
  description: string;
}

type AgentState = {
  model: string;
  research_question: string;
  report: string;
  resources: any[];
  logs: any[];
}


const model = "openai"
const agent = "research_agent"

export function ResearchCanvas() {

  const { state, setState } = useCoAgent<AgentState>({
    name: agent,
    initialState: {
      model
    },
  });

  useCoAgentStateRender({
    name: agent,
    render: ({ state, nodeName, status }) => {
      if (!state.logs || state.logs.length === 0) {
        return null;
      }
      return <Progress logs={state.logs} />;
    },
  });


  const resources: Resource[] = state.resources || [];

  return (
    <div className="w-full h-full overflow-y-auto p-10 bg-[#e1f7f4]">
      <div className="space-y-8 pb-10 bg-[#e1f7f4]">
      {resources.length !== 0 && (<div className="mb-4">
            <h2 className="text-lg font-medium text-primary">Resources</h2>  
            <Resources
              resources={resources}
            />
          </div>
        )}

        <div className="flex flex-col h-full">
          <h2 className="text-lg font-medium mb-3 text-primary">
            Research
          </h2>
          <Textarea
            data-test-id="research-draft"
            placeholder="Write your research draft here"
            value={state.report || ""}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setState({ ...state, report: e.target.value })}
            rows={10}
            aria-label="Research draft"
            className="bg-background px-6 py-8 border-0 shadow-none rounded-xl text-md font-extralight focus-visible:ring-0 placeholder:text-muted-foreground"
            style={{ minHeight: "200px" }}
          />
        </div>
      </div>
    </div>
  );
}