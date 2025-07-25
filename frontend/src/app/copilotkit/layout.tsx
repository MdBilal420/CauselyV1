"use client"
import "@copilotkit/react-ui/styles.css";
import React, { ReactNode } from "react";
import { CopilotKit } from "@copilotkit/react-core";
import Main from "../components/Main";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <CopilotKit
      runtimeUrl="/api/copilotkit"
      agent="research_agent"
      showDevConsole={false}
    >
      <Main />
    </CopilotKit>
  );
}
