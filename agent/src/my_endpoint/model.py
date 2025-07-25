"""
This module provides a function to get a model based on the configuration.
"""
import os
from typing import cast, Any
from langchain_core.language_models.chat_models import BaseChatModel
from src.my_endpoint.state import AgentState


def get_model(state: AgentState) -> BaseChatModel:
    """
    Get a model based on the environment variable.
    """

    state_model = state.get("model")
    model = os.getenv("MODEL", state_model)

    print(f"Using model: {model}")

    if model == "groq":
        from langchain_groq import ChatGroq
        return ChatGroq(
            temperature=0,
            model="deepseek-r1-distill-llama-70b",
            api_key=cast(Any, os.getenv("GROQ_API_KEY")) or None
        )   

    if model == "google_genai":
        from langchain_google_genai import ChatGoogleGenerativeAI
        return ChatGoogleGenerativeAI(
            temperature=0,
            model="gemini-2.0-flash",
            api_key=cast(Any, os.getenv("GOOGLE_API_KEY")) or None
        )
    
    else:
        from langchain_google_genai import ChatGoogleGenerativeAI
        return ChatGoogleGenerativeAI(
            temperature=0,
            model="gemini-2.0-flash",
            api_key=cast(Any, os.getenv("GOOGLE_API_KEY")) or None
        )  