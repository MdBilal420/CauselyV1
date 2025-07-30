"""
This is the state definition for the AI.
It defines the state of the agent and the state of the conversation.
"""

from typing import List, TypedDict, Optional
from langgraph.graph import MessagesState

class Resource(TypedDict):
    """
    Represents a resource. Give it a good title and a short description.
    """
    url: str
    title: str
    description: str

class Log(TypedDict):
    """
    Represents a log of an action performed by the agent.
    """
    message: str
    done: bool

class DetailedCharityInfo(TypedDict):
    """
    Represents detailed information about a charity.
    """
    name: str
    url: str
    mission: str
    impact: str
    programs: List[str]
    financials: dict
    leadership: List[str]
    ratings: dict
    location: str
    founded: str
    size: str
    beneficiaries: str
    transparency: str
    recent_news: List[str]
    strengths: List[str]
    concerns: List[str]
    donation_info: dict

class Charity(TypedDict):
    """
    Represents a charity.
    """
    name: str
    description: str
    url: str
    detailed_info: Optional[DetailedCharityInfo]

class AgentState(MessagesState):
    """
    This is the state of the agent.
    It is a subclass of the MessagesState class from langgraph.
    """
    model: str
    research_question: str
    report: str
    resources: List[Resource]
    logs: List[Log]
    charities: List[Charity]


def create_initial_state():
    """
    Create the initial state of the agent.
    """
    return AgentState(
        model="openai",
        research_question="",
        report="",
        resources=[],
        logs=[],
        charities=[])