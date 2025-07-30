from typing import Literal, cast
from my_endpoint.download import get_resource
from langchain_core.messages import AIMessage, SystemMessage
from langchain_core.runnables import RunnableConfig
from langgraph.types import Command
from my_endpoint.state import AgentState
from my_endpoint.model import get_model
import json
import re


async def final_charity_data_node(state: AgentState, config: RunnableConfig) -> \
    Command[Literal["__end__"]]:
    """
    Final Charity Data Node - Processes all resources to extract charity information
    """
    print("FINAL CHARITY DATA NODE - Processing resources for charity extraction")
    
    # Get all resources with their content
    resources = []
    for resource in state.get("resources", []):
        content = get_resource(resource["url"])
        if content == "ERROR":
            continue
        resources.append({
            **resource,
            "content": content
        })
    
    if not resources:
        print("No resources available for charity extraction")
        return Command(
            goto="__end__",
            update={
                "charities": [],
                "messages": [AIMessage(content="No resources available to extract charity information from.")]
            }
        )
    
    # Use the same model as chat node
    model = get_model(state)
    
    # Prepare the kwargs for the ainvoke method
    ainvoke_kwargs = {}
    if model.__class__.__name__ in ["ChatOpenAI"]:
        ainvoke_kwargs["parallel_tool_calls"] = False
    
    response = await model.ainvoke([
        SystemMessage(
            content=f"""
            You are a charity extraction specialist. Your task is to analyze the provided resources and extract information about charities, non-profit organizations, or charitable causes mentioned in the content.
            
            For each charity/organization you find, extract:
            - name: The name of the charity or organization
            - description: A brief description of what they do or their mission
            - url: The website URL if available, or a relevant link
            
            Return your response as a JSON array of charity objects. Each object should have exactly these three fields: name, description, url.
            
            Example of a valid response:
            ```json
            [
                {{
                    "name": "Charity A",
                    "description": "A brief description of Charity A.",
                    "url": "https://charitya.org"
                }},
                {{
                    "name": "Charity B",
                    "description": "A brief description of Charity B.",
                    "url": "https://charityb.org"
                }}
            ]
            ```
            
            If no charities are found, return an empty array [].
            
            Here are the resources to analyze:
            {json.dumps([{"title": r["title"], "description": r["description"], "content": r["content"][:2000] + "..." if len(r["content"]) > 2000 else r["content"]} for r in resources], indent=2)}
            
            Respond with ONLY the JSON array, no additional text or explanation.
            """
        )
    ], config)
    
    ai_message = cast(AIMessage, response)
    

    try:
        # Attempt to extract JSON from the response, in case it's embedded in other text
        json_match = re.search(r"```json\n(\[.*\])\n```", ai_message.content, re.DOTALL)
        if json_match:
            json_string = json_match.group(1)
            charities_data = json.loads(json_string)
        else:
            charities_data = json.loads(ai_message.content)
        
        # Validate the structure
        if not isinstance(charities_data, list):
            charities_data = []
        
        # Filter to ensure each charity has the required fields
        valid_charities = []
        for charity in charities_data:
            if isinstance(charity, dict) and all(key in charity for key in ["name", "description", "url"]):
                valid_charities.append({
                    "name": str(charity["name"]),
                    "description": str(charity["description"]),
                    "url": str(charity["url"])
                })
        
        print(f"Extracted {len(valid_charities)} charities from resources")
        
        return Command(
            goto="__end__",
            update={
                "charities": valid_charities,
                "messages": [AIMessage(content=f"Extracted {len(valid_charities)} charities.")]
            }
        )
        
    except json.JSONDecodeError:
        print("Failed to parse JSON response from AI")
        return Command(
            goto="__end__",
            update={
                "charities": [],
                "messages": [AIMessage(content="Failed to extract charity information from resources.")]
            }
        )