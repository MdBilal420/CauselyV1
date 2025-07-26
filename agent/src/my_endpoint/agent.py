"""
This is the main entry point for the AI.
It defines the workflow graph and the entry point for the agent.
"""
# pylint: disable=line-too-long, unused-import
import json
import os
from typing import cast

from langchain_core.messages import AIMessage, ToolMessage
from langgraph.graph import StateGraph, END
from my_endpoint.state import AgentState
from my_endpoint.download import download_node
from my_endpoint.chat import chat_node
from my_endpoint.search import search_node

# Define a new graph
workflow = StateGraph(AgentState)
workflow.add_node("download", download_node)
workflow.add_node("chat_node", chat_node)
workflow.add_node("search_node", search_node)


workflow.set_entry_point("download")
workflow.add_edge("download", "chat_node")
workflow.add_edge("search_node", "download")

# Conditionally use a checkpointer based on the environment
# This allows compatibility with both LangGraph API and CopilotKit
# compile_kwargs = {"interrupt_after": ["delete_node"]}

# Check if we're running in LangGraph API mode
if os.environ.get("LANGGRAPH_API", "false").lower() == "true":
    # When running in LangGraph API, don't use a custom checkpointer
    graph = workflow.compile()
else:
    # For CopilotKit and other contexts, use MemorySaver
    from langgraph.checkpoint.memory import MemorySaver
    memory = MemorySaver()
    graph = workflow.compile(checkpointer=memory)