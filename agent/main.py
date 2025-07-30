
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
from agent import graph

# Local research agent components
#from src.my_endpoint.langgraph_research_agent import build_research_graph, web_search, create_detailed_report, research_node
# from src.my_endpoint.deep_research import build_research_graph

# Custom AG-UI protocol event classes
class StateDeltaEvent(BaseModel):
    """
    Custom AG-UI protocol event for partial state updates using JSON Patch.
    
    This event allows for efficient updates to the frontend state by sending
    only the changes (deltas) that need to be applied, following the JSON Patch
    standard (RFC 6902). This approach reduces bandwidth and improves real-time
    feedback to the user.
    
    Attributes:
        type (str): Event type identifier, fixed as "STATE_DELTA"
        message_id (str): Unique identifier for the message this event belongs to
        delta (list): List of JSON Patch operations to apply to the frontend state
    """
    type: str = "STATE_DELTA"
    message_id: str
    delta: list  # List of JSON Patch operations (RFC 6902)

class StateSnapshotEvent(BaseModel):
    """
    Custom AG-UI protocol event for complete state replacement.
    
    This event replaces the entire frontend state with a new snapshot.
    It's typically used for initial state setup or when many state changes
    need to be applied at once, making a delta update inefficient.
    
    Attributes:
        type (str): Event type identifier, fixed as "STATE_SNAPSHOT"
        message_id (str): Unique identifier for the message this event belongs to
        snapshot (Dict[str, Any]): Complete state object to replace the current state
    """
    type: str = "STATE_SNAPSHOT"
    message_id: str
    snapshot: Dict[str, Any]  # Complete state object

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
    uvicorn.run("main:app", host="0.0.0.0", port=8080,
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