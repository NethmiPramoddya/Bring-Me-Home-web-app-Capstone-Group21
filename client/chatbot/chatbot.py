from typing import List, Dict
from langgraph.graph import StateGraph, START, END
from langchain_ollama.llms import OllamaLLM


class State(Dict):
    messages: List[Dict[str, str]] 


graph_builder = StateGraph(State)

llm = OllamaLLM(model="llama3.2")


def chatbot(state: State):
    response = llm.invoke(state["messages"])
    state["messages"].append({"role": "assistant", "content": response})  # Treat response as a string
    return {"messages": state["messages"]}



