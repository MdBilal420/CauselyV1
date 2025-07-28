"""
This is the main entry point for the AI.
It defines the workflow graph and the entry point for the agent.
"""
# pylint: disable=line-too-long, unused-import
import os

from langgraph.graph import StateGraph, END
from my_endpoint.state import AgentState
from my_endpoint.download import download_node
from my_endpoint.chat import chat_node
from my_endpoint.final_charity_data import final_charity_data_node
from my_endpoint.search import search_node
from my_endpoint.charity_research import charity_research_node

# Define a new graph
workflow = StateGraph(AgentState)
workflow.add_node("download", download_node)
workflow.add_node("chat_node", chat_node)
workflow.add_node("search_node", search_node)
workflow.add_node("final_charity_data", final_charity_data_node)
workflow.add_node("charity_research_node", charity_research_node)


workflow.set_entry_point("download")
workflow.add_edge("download", "chat_node")
workflow.add_edge("search_node", "download")
workflow.add_edge("final_charity_data", END)
workflow.add_edge("charity_research_node", "chat_node")

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