"""
This is the main entry point for the AI.
It defines the workflow graph and the entry point for the agent.
"""
# pylint: disable=line-too-long, unused-import
import json
import os
from typing import cast

from langchain_core.messages import AIMessage, ToolMessage
from langchain_core.runnables import RunnableConfig
from langgraph.graph import StateGraph, END
from src.my_endpoint.state import AgentState, create_initial_state
from src.my_endpoint.download import download_node
from src.my_endpoint.chat import chat_node
from src.my_endpoint.search import search_node
from src.my_endpoint.delete import delete_node, perform_delete_node


async def initialize_state_node(state: AgentState, config: RunnableConfig):
    """
    Initialize the state with default values for all fields.
    This ensures that the state has all required fields before the workflow starts.
    """
    # Initialize state fields with default values if they don't exist
    if "resources" not in state:
        state["resources"] = []
    if "logs" not in state:
        state["logs"] = []
    if "model" not in state:
        state["model"] = "google_genai"
    if "research_question" not in state:
        state["research_question"] = ""
    if "report" not in state:
        state["report"] = ""
    if "messages" not in state:
        state["messages"] = []
    
    # Check for configurable values in the config
    if config and "configurable" in config:
        configurable = config["configurable"]
        # Update state with any configurable values provided
        for field in ["model", "research_question", "report", "resources", "logs", "messages"]:
            if field in configurable:
                state[field] = configurable[field]
    
    print("State initialized:", state)
    return state


# Define a new graph
workflow = StateGraph(AgentState)
workflow.add_node("initialize_state", initialize_state_node)
workflow.add_node("download", download_node)
workflow.add_node("chat_node", chat_node)
workflow.add_node("search_node", search_node)
workflow.add_node("delete_node", delete_node)
workflow.add_node("perform_delete_node", perform_delete_node)

workflow.set_entry_point("initialize_state")
workflow.add_edge("initialize_state", "download")
workflow.add_edge("download", "chat_node")
workflow.add_edge("delete_node", "perform_delete_node")
workflow.add_edge("perform_delete_node", "chat_node")
workflow.add_edge("search_node", "download")

# Conditionally use a checkpointer based on the environment
# This allows compatibility with both LangGraph API and CopilotKit
compile_kwargs = {"interrupt_after": ["delete_node"]}

# Check if we're running in LangGraph API mode
if os.environ.get("LANGGRAPH_API", "false").lower() == "true":
    # When running in LangGraph API, don't use a custom checkpointer
    graph = workflow.compile(**compile_kwargs)
else:
    # For CopilotKit and other contexts, use MemorySaver
    from langgraph.checkpoint.memory import MemorySaver
    memory = MemorySaver()
    compile_kwargs["checkpointer"] = memory
    graph = workflow.compile(**compile_kwargs)