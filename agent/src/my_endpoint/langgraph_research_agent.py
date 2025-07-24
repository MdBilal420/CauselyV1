import asyncio
import os
import json
from datetime import datetime
from dotenv import load_dotenv
load_dotenv()
from langgraph.graph import Graph, END
from langchain_core.messages import AIMessage, HumanMessage, SystemMessage
import requests
from langchain_groq import ChatGroq
from langgraph.checkpoint.memory import InMemorySaver




def web_search(query):
    api_key = os.environ["SERPER_API_KEY"]
    url = "https://google.serper.dev/search"
    headers = {"X-API-KEY": api_key, "Content-Type": "application/json"}
    payload = {"q": query}
    response = requests.post(url, headers=headers, json=payload)
    results = response.json()
    
    # Extract different types of results
    organic_results = results.get("organic", [])
    knowledge_graph = results.get("knowledgeGraph", {})
    related_searches = results.get("relatedSearches", [])
    people_also_ask = results.get("peopleAlsoAsk", [])
    
    if not organic_results:
        return "No relevant research results were found on the topic."
    
    
    # Compile all results into a structured format
    compiled_results = {
        "organic": organic_results[:5],  # Increased from 3 to 5 results
        "knowledgeGraph": knowledge_graph if knowledge_graph else None,
        "relatedSearches": related_searches[:3] if related_searches else None,
        "peopleAlsoAsk": people_also_ask[:3] if people_also_ask else None
    }
    
    return compiled_results

def create_detailed_report(search_results):
    # Check if search_results is a string (error message) or a dict (actual results)
    if isinstance(search_results, str):
        return search_results  # Just return the error message
    
    # Extract organic results
    organic_results = search_results.get("organic", [])
    
    # Create structured JSON response with name, URL, and image
    structured_results = []
    
    for result in organic_results[:5]:  # Limit to top 5 results
        structured_result = {
            "name": result.get("title", "No title"),
            "url": result.get("link", result.get("url", "No link")),
            "image": result.get("imageUrl", "No image available"),
            "snippet": result.get("snippet", "No preview")
        }
        structured_results.append(structured_result)
    
    # Extract knowledge graph information if available
    knowledge_graph = search_results.get("knowledgeGraph")
    if knowledge_graph:
        kg_result = {
            "name": knowledge_graph.get("title", "Knowledge Graph"),
            "url": knowledge_graph.get("link", "No link"),
            "image": knowledge_graph.get("imageUrl", "No image available"),
            "snippet": f"Type: {knowledge_graph.get('type', 'Unknown')}"
        }
        structured_results.append(kg_result)
    
    # Create a summary using ChatGroq
    client = ChatGroq(model="llama3-8b-8192")
    
    # Format organic results for summary
    organic_text = "\n\n".join([
        f"Title: {r.get('title', 'No title')}\nSnippet: {r.get('snippet', 'No preview')}\nLink: {r.get('link', r.get('url', 'No link'))}"
        for r in organic_results
    ])
    
    # Create system and user messages for ChatGroq
    system_message = SystemMessage(content="Provide a short summary of the topic based on the provided search results. Just give the main idea and key points in 2-4 sentences.")
    user_message = HumanMessage(content=organic_text)
    
    # Use the correct ChatGroq API
    response = client.invoke([system_message, user_message])
    summary = response.content
    
    # Return structured JSON response
    return {
        "summary": summary,
        "results": structured_results,
        "total_results": len(structured_results)
    }

async def research_node(state):
    try:
        # In LangGraph, when passing messages directly, state is the list of messages
        if isinstance(state, list):
            messages = state
        else:
            # Fallback for dictionary state format
            messages = state.get("messages", [])
        
        if not messages:
            error_response = {
                "type": "input_error",
                "data": {
                    "error": "No query provided",
                    "timestamp": datetime.now().isoformat()
                }
            }
            return [AIMessage(content=json.dumps(error_response))]
        
        # Get the query from the last message
        query = messages[-1].content
        
        # Perform search (web_search is not async, so we don't await it)
        search_results = web_search(query)
        
        # Check if search failed
        if isinstance(search_results, str):
            # Return search error as JSON structure
            error_response = {
                "type": "search_error",
                "data": {
                    "error": search_results,
                    "query": query,
                    "timestamp": datetime.now().isoformat()
                }
            }
            return [AIMessage(content=json.dumps(error_response))]
        
        # Generate report
        report_data = create_detailed_report(search_results)
        
        # Check if report_data is a string (error message) or dict (structured results)
        if isinstance(report_data, str):
            # Return error as JSON structure
            error_response = {
                "type": "research_error",
                "data": {
                    "error": report_data,
                    "query": query,
                    "timestamp": datetime.now().isoformat()
                }
            }
            return [AIMessage(content=json.dumps(error_response))]
        
        # Create structured JSON response instead of markdown
        summary = report_data.get("summary", "No summary available")
        results = report_data.get("results", [])
        
        # Create JSON response with structured data
        json_response = {
            "type": "research_results",
            "data": {
                "summary": summary,
                "results": results,
                "metadata": {
                    "total_results": len(results),
                    "query": query,
                    "timestamp": datetime.now().isoformat(),
                    "search_type": "web_search"
                }
            }
        }
        
        return [AIMessage(content=json.dumps(json_response))]
        
    except Exception as e:
        error_response = {
            "type": "system_error",
            "data": {
                "error": f"Research process failed: {str(e)}",
                "timestamp": datetime.now().isoformat()
            }
        }
        return [AIMessage(content=json.dumps(error_response))]

def build_research_graph():
    """
    Build and compile a research workflow graph using LangGraph.
    
    This function creates a simple graph with a single research node that:
    1. Takes a query as input
    2. Performs a web search
    3. Creates a detailed report
    
    Returns:
        A compiled LangGraph that can be run with input messages
    """
    print(f"[DEBUG] Building LangGraph research graph")
    
    # Create a new graph
    workflow = Graph()
    
    # Add the research node
    workflow.add_node("research", research_node)
    
    # Set the entry point for the graph
    workflow.set_entry_point("research")
    
    # Set the research node as also the exit point
    # This ensures that the final report from the research node is returned as output
    workflow.add_edge("research", END)
    
    # Compile the graph before returning it
    try:
        compiled_graph = workflow.compile()
        return compiled_graph
    except Exception as e:
        return workflow