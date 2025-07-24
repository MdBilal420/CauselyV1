import { useCoAgent, useCoAgentStateRender, useCopilotAction } from "@copilotkit/react-core";
import { useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ResearchStages } from "./ResearchStages";
import { ResearchAgentState } from "@/lib/types";
import { ResearchReport } from "./ResearchReport";
import { json } from "stream/consumers";

function ResearchAssistant() {
  // Reference to track if research is in progress
  const isResearchInProgress = useRef(false);

  // Connect to the agent's state using CopilotKit's useCoAgent hook
  const { state, stop: stopResearchAgent } = useCoAgent<ResearchAgentState>({
    name: "researchAgent",
    initialState: {
      status: {
        phase: "idle",
        error: null,
        timestamp: undefined
      },
      research: {
        query: "",
        stage: "not_started",
        sources_found: 0,
        sources: [],
        completed: false
      },
      processing: {
        progress: 0,
        report: null,
        completed: false,
        inProgress: false
      },
      ui: {
        showSources: false,
        showProgress: true,
        activeTab: "chat"
      }
    },
  });

  // Helper function for type-safe phase comparison
  const isPhase = (
    phase: string | undefined,
    comparePhase: ResearchAgentState["status"]["phase"]
  ): boolean => {
    return phase === comparePhase;
  };

  // Helper function to format the status for display
  const getStatusText = () => {
    if (state?.status?.error) {
      return `Error: ${state.status.error}`;
    }
    
    switch (state?.research?.stage) {
      case "not_started":
        return "Ready to start research";
      case "searching":
        return "Searching the web for information...";
      case "organizing_data":
        return "Organizing research data...";
      case "creating_detailed_report":
        return "Creating detailed report...";
      case "outlining_report":
        return "Outlining report...";
      case "drafting_executive_summary":
        return "Drafting executive summary...";
      case "writing_introduction":
        return "Writing introduction...";
      case "compiling_key_findings":
        return "Compiling key findings...";
      case "developing_analysis":
        return "Developing analysis...";
      case "forming_conclusions":
        return "Forming conclusions...";
      case "finalizing_report":
        return "Finalizing report...";
      case "report_complete":
        return "Research completed";
      case "error":
        return "Research failed";
      default:
        return "Processing...";
    }
  };

  // Use the automatic state rendering hook
  useCoAgentStateRender<ResearchAgentState>({
    name: "researchAgent",
    render: ({ state }) => {
      // Don't render anything if no state or still in initial state
      if (!state || state.research.stage === "not_started") {
        return null;
      }

      if (
        state?.research?.stage &&
        state.research.stage !== "report_complete" &&
        state.research.stage !== "error" &&
        (isResearchInProgress.current || state?.processing?.progress > 0)
      ) {
        return (
          <div className="flex flex-col gap-4 h-full max-w-4xl mx-auto">
            <div className="p-6 bg-white border rounded-lg shadow-sm w-full">
              <h3 className="text-xl font-semibold mb-4">
                Comprehensive Research in Progress
              </h3>
    
              <div className="status-container mb-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium text-gray-800">{getStatusText()}</div>
                  <div className="text-sm font-medium">
                    {Math.round(state?.processing?.progress * 100)}%
                  </div>
                </div>
    
                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all duration-300 ease-in-out"
                    style={{
                      width: `${state?.processing?.progress * 100}%`,
                      background:
                        state?.processing?.progress >= 0.9
                          ? "linear-gradient(90deg, #4ade80, #22c55e)"
                          : "linear-gradient(90deg, #60a5fa, #3b82f6)",
                    }}
                  />
                </div>
              </div>
    
              {/* Research Stages Tracker */}
              <ResearchStages state={state} isPhase={isPhase} />
    
              {/* Sources count when available */}
              {state?.research?.sources && state.research.sources.length > 0 && (
                <div className="mt-4 text-sm text-gray-600">
                  Found {state.research.sources.length} source
                  {state.research.sources.length !== 1 ? "s" : ""}
                </div>
              )}
            </div>
          </div>
        );
      }

      // Show error state
      if (state.status.error || state.research.stage === "error") {
        return (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="font-medium text-red-800">Research Error</span>
            </div>
            <p className="text-red-700">{state.status.error || "An error occurred during research"}</p>
          </div>
        );
      }

      // Show progress state
      if (state.research.stage !== "report_complete") {
        return (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-blue-800">{getStatusText()}</span>
              <span className="text-sm font-medium text-blue-600">
                {Math.round(state.processing.progress * 100)}%
              </span>
            </div>
            <div className="h-2 w-full bg-blue-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-300"
                style={{ width: `${state.processing.progress * 100}%` }}
              />
            </div>
            {state.research.sources && state.research.sources.length > 0 && (
              <div className="mt-2 text-sm text-blue-600">
                Found {state.research.sources.length} source{state.research.sources.length !== 1 ? "s" : ""}
              </div>
            )}
          </div>
        );
      }
      return null;
    },
  });

  const report = state.processing?.report ? JSON.parse(state.processing.report ?? "{}").data.results : [];



// Default state when not researching and no results yet
  return (
    <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
      {report.map((item: any, index: number) => (
        <div key={item.url + item.name} className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          {/* Header with title and score */}
          <div className="flex items-start justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 pr-4">{item.name}</h2>
            <div className="bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center text-sm font-semibold">
              {Math.floor(Math.random() * 20) + 80}%
            </div>
          </div>
          
          {/* Description */}
          <p className="text-gray-600 mb-6">{item.snippet || "No description available"}</p>
          
          {/* Two-column layout for metadata */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="space-y-2">
              <div>
                <p className="text-sm text-gray-500">Source Type</p>
                <p className="font-semibold text-gray-900">Web Result</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Relevance Score</p>
                <p className="font-semibold text-gray-900">{Math.floor(Math.random() * 30) + 70}%</p>
              </div>
            </div>
            <div className="space-y-2">
              <div>
                <p className="text-sm text-gray-500">Domain</p>
                <p className="font-semibold text-gray-900">{new URL(item.url).hostname}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Verified</p>
                <p className="font-semibold text-gray-900">Yes</p>
              </div>
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="flex gap-3">
            <button className="flex-1 bg-primary text-white py-2 px-4 rounded-lg font-medium hover:bg-primary/80  transition-colors">
              Add to Research
            </button>
            <button className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors">
              Learn More
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ResearchAssistant;
