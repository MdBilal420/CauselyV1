"""
This module provides a function to get a model based on the configuration.
"""
import os
from typing import cast, Any
from langchain_core.language_models.chat_models import BaseChatModel
from src.my_endpoint.state import AgentState
from langchain_openai import ChatOpenAI
from langchain_google_genai import ChatGoogleGenerativeAI


def get_model(state: AgentState) -> BaseChatModel:
    """
    Get a model based on the environment variable.
    """

    state_model = state.get("model")
    model = os.getenv("MODEL", state_model)

    # return ChatOpenAI(
    #     temperature=0,
    #     model="bilal-gemini-2.5-flash",
    #     # api_key=cast(Any, os.getenv("OPENAI_API_KEY")) or None
    # ) 

    if model == "groq":
        from langchain_groq import ChatGroq
        return ChatGroq(
            temperature=0,
            model="deepseek-r1-distill-llama-70b",
            api_key=cast(Any, os.getenv("GROQ_API_KEY")) or None
        )   

    if model == "google_genai":
        return ChatOpenAI(
            temperature=0,
            model="gpt-4o-mini",
            api_key=cast(Any, os.getenv("OPENAI_API_KEY")) or None
        ) 
    
    elif model == "openai":
        return ChatOpenAI(
            temperature=0,
            model="gpt-4o-mini",
            api_key=cast(Any, os.getenv("OPENAI_API_KEY")) or None
        )  
    else:
        # return ChatOpenAI(
        #     temperature=0,
        #     model="gpt-4o-mini",
        #     api_key=cast(Any, os.getenv("OPENAI_API_KEY")) or None
        # )
        raise ValueError(f"Model {model} not supported") 