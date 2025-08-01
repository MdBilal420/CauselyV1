"use client"
import "@copilotkit/react-ui/styles.css";
import React from "react";
import { CopilotKit } from "@copilotkit/react-core";
import Main from "../components/Main";

export default function Layout() {
  return (
    <CopilotKit
      runtimeUrl="/api/copilotkit"
      agent="research_agent"
      showDevConsole={true}
    >
      <Main />
    </CopilotKit>
  );
}
