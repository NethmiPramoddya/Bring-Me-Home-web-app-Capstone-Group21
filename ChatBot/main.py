from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict
from langgraph.graph import StateGraph, START, END
from langchain_ollama.llms import OllamaLLM

class State(Dict):
    messages: List[Dict[str, str]]

llm = OllamaLLM(model="llama3.2")
graph_builder = StateGraph(State)

def chatbot(state: State):
    response = llm.invoke(state["messages"])
    state["messages"].append({"role": "assistant", "content": response})
    return {"messages": state["messages"]}

graph_builder.add_node("chatbot", chatbot)
graph_builder.add_edge(START, "chatbot")
graph_builder.add_edge("chatbot", END)
graph = graph_builder.compile()


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    messages: List[Dict[str, str]]

@app.post("/chat")
async def chat_endpoint(req: ChatRequest):
    state = {"messages": req.messages}
    
    final_output = None  

    for event in graph.stream(state):
        for value in event.values():
            final_output = value  

    if final_output and "messages" in final_output:
        return {"messages": final_output["messages"]}
    else:
        return {"error": "No response from model"}
