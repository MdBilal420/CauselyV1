"""Chat Node"""

from typing import List, cast, Literal
from langchain_core.runnables import RunnableConfig
from langchain_core.messages import SystemMessage, AIMessage, ToolMessage
from langchain.tools import tool
from langgraph.types import Command
from copilotkit.langgraph import copilotkit_customize_config
from src.my_endpoint.state import AgentState
from src.my_endpoint.model import get_model
from src.my_endpoint.download import get_resource



@tool
def Search(queries: List[str]): # pylint: disable=invalid-name,unused-argument
    """A list of one or more search queries to find good resources to support the research."""

@tool
def WriteReport(report: str): # pylint: disable=invalid-name,unused-argument
    """Write the research report."""

@tool
def WriteResearchQuestion(research_question: str): # pylint: disable=invalid-name,unused-argument
    """Write the research question."""

@tool
def DeleteResources(urls: List[str]): # pylint: disable=invalid-name,unused-argument
    """Delete the URLs from the resources."""

@tool
def ResearchCharity(charity_name: str, charity_url: str = ""): # pylint: disable=invalid-name,unused-argument
    """Research a specific charity in detail to provide comprehensive information including mission, impact, financials, ratings, and more."""


async def chat_node(state: AgentState, config: RunnableConfig) -> \
    Command[Literal["search_node", "chat_node", "final_charity_data", "charity_research_node", "__end__"]]:
    """
    Chat Node
    """
    # print("CHAT NODE STATE", state)
    config = copilotkit_customize_config(
        config,
        emit_intermediate_state=[{
            "state_key": "report",
            "tool": "WriteReport",
            "tool_argument": "report",
        }, {
            "state_key": "research_question",
            "tool": "WriteResearchQuestion",
            "tool_argument": "research_question",
        }],
    )

    state["resources"] = state.get("resources", [])
    state["charities"] = state.get("charities", [])
    research_question = state.get("research_question", "")
    report = state.get("report", "")

    resources = []

    for resource in state["resources"]:
        content = get_resource(resource["url"])
        if content == "ERROR":
            continue
        resources.append({
            **resource,
            "content": content
        })

    model = get_model(state)
    # Prepare the kwargs for the ainvoke method
    ainvoke_kwargs = {}
    if model.__class__.__name__ in ["ChatOpenAI"]:
        ainvoke_kwargs["parallel_tool_calls"] = False

    response = await model.bind_tools(
        [
            Search,
            WriteReport,
            WriteResearchQuestion,
            DeleteResources,
            ResearchCharity,
        ],
        **ainvoke_kwargs  # Pass the kwargs conditionally
    ).ainvoke([
        SystemMessage(
            content=f"""
            You are a world-class philanthropy advisor. Your goal is to help the user build a detailed philanthropy profile and then use that profile to research and recommend suitable charities.
            When searching, focus on finding smaller, lesser-known organizations that are highly effective but may not have widespread name recognition. Avoid large, well-known charities that the user likely already knows.
            
            - First, have a conversation with the user to build their philanthropy profile. Ask about the causes they care about, their geographic focus, and the scale of their intended giving.
            - Once the profile is reasonably complete, use the Search tool to find organizations that match the profile. Formulate queries that are likely to uncover smaller, impactful charities.
            - After searching, use the information to provide the user with a few potential charity recommendations.
            - If the user wants detailed information about a specific charity, use the ResearchCharity tool to conduct in-depth research.
            - If you have finished writing the report, ask the user proactively for next steps, changes, etc., to make the process engaging.
            - To write the report, you should use the WriteReport tool. Never respond with the report directly; only use the tool.
            - If a research question is provided, YOU MUST NOT ASK FOR IT AGAIN.
            - When you have charity recommendations, offer to research any of them in detail for the user.
            


            This is the research question:
            {research_question}

            This is the research report:
            {report}

            Here are the resources that you have available:
            {resources}
            """
        ),
        *state["messages"],
    ], config)

    ai_message = cast(AIMessage, response)

    # Handle tool calls
    if ai_message.tool_calls:
        tool_name = ai_message.tool_calls[0]["name"]
        
        if tool_name == "WriteReport":
            report = ai_message.tool_calls[0]["args"].get("report", "")
            return Command(
                goto="chat_node",
                update={
                    "report": report,
                    "messages": [ai_message, ToolMessage(
                        tool_call_id=ai_message.tool_calls[0]["id"],
                        content="Report written."
                    )]
                }
            )
        elif tool_name == "WriteResearchQuestion":
            return Command(
                goto="chat_node",
                update={
                    "research_question": ai_message.tool_calls[0]["args"]["research_question"],
                    "messages": [ai_message, ToolMessage(
                        tool_call_id=ai_message.tool_calls[0]["id"],
                        content="Research question written."
                    )]
                }
            )
        elif tool_name == "Search":
            return Command(
                goto="search_node",
                update={
                    "messages": [ai_message]
                }
            )
        elif tool_name == "ResearchCharity":
            return Command(
                goto="charity_research_node",
                update={
                    "messages": [ai_message, ToolMessage(
                        tool_call_id=ai_message.tool_calls[0]["id"],
                        content="Starting detailed charity research..."
                    )]
                }
            )

    # No tool calls, check if research is complete
    # If we have resources and a report, go to final charity data node
    resources_count = len(state.get("resources", []))
    has_report = bool(state.get("report", ""))
    
    print(f"Research status - Resources: {resources_count}, Has report: {has_report}")
    
    if resources_count > 0 and report:
        print("Research complete, proceeding to final charity data extraction")
        return Command(
            goto="final_charity_data",
        )
    else:
        # End the conversation if research is not complete
        print("Research not complete, ending conversation")
        return Command(
            goto="__end__",
            update={
                "messages": [ai_message]
            }
        )

