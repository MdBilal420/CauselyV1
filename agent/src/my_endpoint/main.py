
# Standard library imports
import os
import uuid
import asyncio
from datetime import datetime
from typing import Dict, Any, List

# Third-party imports
from dotenv import load_dotenv  # Environment variable management
load_dotenv()  # Load environment variables from .env file
from fastapi import FastAPI, Request  # Web framework
from fastapi.responses import StreamingResponse  # For streaming responses
from pydantic import BaseModel  # For data validation

from ag_ui.encoder import EventEncoder  # Encodes events to Server-Sent Events format

import uvicorn
from copilotkit.integrations.fastapi import add_fastapi_endpoint
from copilotkit import CopilotKitRemoteEndpoint, LangGraphAGUIAgent
# from copilotkit.crewai import CrewAIAgent
# from src.my_endpoint.crewai.agent import ResearchCanvasFlow
from ag_ui_langgraph import add_langgraph_fastapi_endpoint
from src.my_endpoint.agent import graph

# Local research agent components
#from src.my_endpoint.langgraph_research_agent import build_research_graph, web_search, create_detailed_report, research_node
# from src.my_endpoint.deep_research import build_research_graph

# Create FastAPI application
app = FastAPI()

add_langgraph_fastapi_endpoint(
    app=app,
    agent=LangGraphAGUIAgent(
        name="research_agent",
        description="Research agent.",
        graph=graph
    ),
    path="/copilotkit/agents/research_agent"
)

def main():
    """
    Entry point for running the FastAPI server.
    
    This function starts a uvicorn server to host the FastAPI application
    with the following configuration:
    - Host: 0.0.0.0 (accessible from other machines)
    - Port: 8000
    - Hot reload: Enabled for development
    """
    uvicorn.run("src.my_endpoint.main:app", host="0.0.0.0", port=8080, reload=True,
        reload_dirs=(
            ["."] +
            (["../../../../sdk-python/copilotkit"]
             if os.path.exists("../../../../sdk-python/copilotkit")
             else []
             )
        )
                )
 
if __name__ == "__main__":
    main()