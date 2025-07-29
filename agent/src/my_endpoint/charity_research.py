"""
Charity Research Node - Provides detailed research about individual charities
"""

from typing import Literal, cast, List
from langchain_core.messages import AIMessage, SystemMessage, ToolMessage
from langchain_core.runnables import RunnableConfig
from langgraph.types import Command
from my_endpoint.state import AgentState
from my_endpoint.model import get_model
from my_endpoint.search import async_tavily_search
from copilotkit.langgraph import copilotkit_emit_state
import json
import asyncio


async def charity_research_node(state: AgentState, config: RunnableConfig) -> \
    Command[Literal["chat_node", "__end__"]]:
    """
    Charity Research Node - Conducts detailed research on a specific charity
    """
    print("CHARITY RESEARCH NODE - Starting detailed charity research")
    
    # Get the charity to research from the messages
    messages = state.get("messages", [])
    if not messages:
        return Command(goto="chat_node")
    
    charity_name = None
    charity_url = None
    
    # Look for the AI message with the ResearchCharity tool call
    for message in reversed(messages):
        if hasattr(message, 'tool_calls') and message.tool_calls:
            for tool_call in message.tool_calls:
                if tool_call["name"] == "ResearchCharity":
                    charity_name = tool_call["args"].get("charity_name")
                    charity_url = tool_call["args"].get("charity_url", "")
                    break
            if charity_name:
                break
    
    if not charity_name:
        print("No charity name found for research")
        return Command(
            goto="chat_node",
            update={
                "messages": [AIMessage(content="I couldn't find the charity name to research. Please specify which charity you'd like me to research in detail.")]
            }
        )
    
    # Initialize logs for this research
    state["logs"] = []
    
    # Add research progress logs
    research_queries = [
        f'"{charity_name}" charity mission impact effectiveness',
        f'"{charity_name}" nonprofit financial transparency annual report 990',
        f'"{charity_name}" charity programs services who they help',
        f'"{charity_name}" charity leadership executive director CEO',
        f'"{charity_name}" charity navigator guidestar rating review'
    ]
    
    for query in research_queries:
        state["logs"].append({
            "message": f"Researching: {query}",
            "done": False
        })
    
    await copilotkit_emit_state(config, state)
    
    # Perform detailed searches
    search_results = []
    tasks = [async_tavily_search(query) for query in research_queries]
    results = await asyncio.gather(*tasks, return_exceptions=True)
    
    for i, result in enumerate(results):
        if isinstance(result, Exception):
            search_results.append({"error": str(result)})
        else:
            search_results.append(result)
        
        state["logs"][i]["done"] = True
        await copilotkit_emit_state(config, state)
    
    # Use AI to analyze and compile detailed charity information
    model = get_model(state)
    ainvoke_kwargs = {}
    if model.__class__.__name__ in ["ChatOpenAI"]:
        ainvoke_kwargs["parallel_tool_calls"] = False
    
    response = await model.ainvoke([
        SystemMessage(
            content=f"""
            You are a charity research specialist. Analyze the provided search results to create a comprehensive profile for the charity "{charity_name}".
            
            You must respond with a valid JSON object only. Do not include any markdown formatting, explanations, or additional text.
            
            Use this exact structure:
            {{
                "name": "{charity_name}",
                "url": "{charity_url or 'Not available'}",
                "mission": "Brief mission statement based on search results",
                "impact": "Description of impact and effectiveness",
                "programs": ["Program 1", "Program 2"],
                "financials": {{
                    "revenue": "Annual revenue if found",
                    "expenses": "Annual expenses if found", 
                    "efficiency": "Efficiency metrics if found"
                }},
                "leadership": ["Leader 1", "Leader 2"],
                "ratings": {{
                    "charity_navigator": "Rating if found",
                    "guidestar": "Rating if found",
                    "other_ratings": "Other ratings if found"
                }},
                "location": "Primary location",
                "founded": "Year founded",
                "size": "Organization size info",
                "beneficiaries": "Who they serve",
                "transparency": "Transparency info",
                "recent_news": ["News item 1", "News item 2"],
                "strengths": ["Strength 1", "Strength 2"],
                "concerns": ["Concern 1 if any"],
                "donation_info": {{
                    "how_to_donate": "How to donate",
                    "tax_deductible": "Tax status",
                    "donation_options": ["Option 1", "Option 2"]
                }}
            }}
            
            If information is not available, use "Not available" for strings and empty arrays [] for lists.
            
            Search Results Summary: {len(search_results)} search results available for analysis.
            
            Respond with only the JSON object.
            """
        )
    ], config)
    
    ai_message = cast(AIMessage, response)
    
    try:
        # Clean the response content
        content = ai_message.content.strip()
        
        # Try to extract JSON if it's wrapped in markdown
        if content.startswith("```json"):
            content = content.replace("```json", "").replace("```", "").strip()
        elif content.startswith("```"):
            content = content.replace("```", "").strip()
        
        # Parse the detailed charity information
        detailed_charity = json.loads(content)
        
        # Ensure it's a valid dictionary
        if not isinstance(detailed_charity, dict):
            raise ValueError("Response is not a valid dictionary")
        
        # Update the charity in the state with detailed information
        charities = state.get("charities", [])
        updated = False
        for i, charity in enumerate(charities):
            if charity["name"].lower() == charity_name.lower():
                charities[i] = {**charity, "detailed_info": detailed_charity}
                updated = True
                break
        
        # If charity not found in existing list, create a new entry
        if not updated:
            charities.append({
                "name": charity_name,
                "description": detailed_charity.get("mission", "Not available"),
                "url": charity_url or detailed_charity.get("url", "Not available"),
                "detailed_info": detailed_charity
            })
        
        # Clear logs
        # state["logs"] = []
        await copilotkit_emit_state(config, state)
        
        print(f"Completed detailed research for {charity_name}")
        
        return Command(
            goto="chat_node",
            update={
                "charities": charities,
                "messages": [
                    AIMessage(content=f"I've completed detailed research on {charity_name}. Here's what I found:\n\n"
                                    f"**Mission**: {detailed_charity.get('mission', 'Not available')}\n\n"
                                    f"**Impact**: {detailed_charity.get('impact', 'Not available')}\n\n"
                                    f"**Key Programs**: {', '.join(detailed_charity.get('programs', ['Not available']))}\n\n"
                                    f"**Financial Efficiency**: {detailed_charity.get('financials', {}).get('efficiency', 'Not available')}\n\n"
                                    f"**Ratings**: {detailed_charity.get('ratings', {}).get('charity_navigator', 'Not available')}\n\n"
                                    f"Would you like me to research any other charities in detail or help you with anything else?")
                ]
            }
        )
        
    except (json.JSONDecodeError, ValueError) as e:
        print(f"Failed to parse detailed charity information: {e}")
        print(f"AI Response content: {ai_message.content[:500]}...")
        
        # Create a basic detailed info structure as fallback
        fallback_info = {
            "name": charity_name,
            "url": charity_url or "Not available",
            "mission": "Research in progress - detailed information will be available shortly",
            "impact": "Not available",
            "programs": [],
            "financials": {"revenue": "Not available", "expenses": "Not available", "efficiency": "Not available"},
            "leadership": [],
            "ratings": {"charity_navigator": "Not available", "guidestar": "Not available", "other_ratings": "Not available"},
            "location": "Not available",
            "founded": "Not available", 
            "size": "Not available",
            "beneficiaries": "Not available",
            "transparency": "Not available",
            "recent_news": [],
            "strengths": [],
            "concerns": [],
            "donation_info": {"how_to_donate": "Not available", "tax_deductible": "Not available", "donation_options": []}
        }
        
        return Command(
            goto="chat_node",
            update={
                "logs": [],
                "messages": [
                    AIMessage(content=f"I've gathered some information about {charity_name}, but encountered a technical issue processing the detailed research. I can try researching this charity again or help you with other charities.")
                ]
            }
        )