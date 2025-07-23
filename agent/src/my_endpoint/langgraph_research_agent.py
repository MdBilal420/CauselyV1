import os
from dotenv import load_dotenv
load_dotenv()
from langgraph.graph import Graph, END
from langchain_core.messages import AIMessage, HumanMessage, SystemMessage
import requests
from langchain_groq import ChatGroq




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
    
    # Extract knowledge graph information if available
    knowledge_graph = search_results.get("knowledgeGraph")
    knowledge_graph_text = ""
    if knowledge_graph:
        kg_items = []
        for key, value in knowledge_graph.items():
            if key not in ["type", "title", "imageUrl"]:
                if isinstance(value, list):
                    kg_items.append(f"{key}: {', '.join(value)}")
                else:
                    kg_items.append(f"{key}: {value}")
        if kg_items:
            knowledge_graph_text = f"Knowledge Graph about {knowledge_graph.get('title', 'the topic')}:\n" + "\n".join(kg_items)
    
    # Extract related searches
    related_searches = search_results.get("relatedSearches", [])
    related_searches_text = ""
    if related_searches:
        related_searches_text = "Related Searches:\n" + "\n".join([f"- {rs}" for rs in related_searches])
    
    # Extract people also ask
    people_also_ask = search_results.get("peopleAlsoAsk", [])
    paa_text = ""
    if people_also_ask:
        paa_items = []
        for q in people_also_ask:
            question = q.get("question", "")
            answer = q.get("snippet", "No answer available")
            if question:
                paa_items.append(f"Q: {question}\nA: {answer}")
        if paa_items:
            paa_text = "People Also Ask:\n" + "\n\n".join(paa_items)
    
    # Format the organic search results
    organic_text = "\n\n".join([
        f"Title: {r.get('title', 'No title')}\nSnippet: {r.get('snippet', 'No preview')}\nLink: {r.get('link', r.get('url', 'No link'))}"
        for r in organic_results
    ])
    
    # Combine all formatted results
    all_research = "\n\n===\n\n".join(filter(None, [
        organic_text, 
        knowledge_graph_text, 
        related_searches_text, 
        paa_text
    ]))
     
    client = ChatGroq(model="llama3-8b-8192")
    
    # Create system and user messages for ChatGroq
    system_message = SystemMessage(content="Provide a short summary of the topic based on the provided search results. Just give the main idea and key points in 2-4 sentences.")
    
    user_message = HumanMessage(content=all_research)
    
    # Use the correct ChatGroq API
    response = client.invoke([system_message, user_message])
    
    report = response.content

    return report

async def research_node(state):
    try:
        # In LangGraph, when passing messages directly, state is the list of messages
        if isinstance(state, list):
            messages = state
        else:
            # Fallback for dictionary state format
            messages = state.get("messages", [])
        
        if not messages:
            return [AIMessage(content="No query provided")]
        
        # Get the query from the last message
        query = messages[-1].content
        
        # Perform search (web_search is not async, so we don't await it)
        search_results = web_search(query)
        
        # Check if search failed
        if isinstance(search_results, str):
            return [AIMessage(content=search_results)]
        
        # Generate report
        report = create_detailed_report(search_results)
        
        return [AIMessage(content=report)]
        
    except Exception as e:
        error_msg = f"Research process failed: {str(e)}"
        return [AIMessage(content=error_msg)]

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
        # Return the uncompiled graph as fallback
        return workflow