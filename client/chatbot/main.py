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

class ChatRequest(BaseModel):
    messages: List[Dict[str, str]]

@app.post("/chat")
async def chat_endpoint(req: ChatRequest):
    print("Incoming request:", req.messages)
    state = {"messages": req.messages}

    try:
        for event in graph.stream(state):
            for value in event.values():
                print("Assistant replied:", value["messages"][-1]["content"])
                return {"messages": value["messages"]}
            
    except Exception as e:
        import traceback
        traceback.print_exc() 
        return {"error": str(e)}






class ChatSessionInfo(BaseModel):
    session_id: str
    user_id: str
    started_at: str = "not_tracked"

class ChatDebugTools:
    @staticmethod
    def summarize_roles(messages: List[Dict[str, str]]) -> Dict[str, int]:
        summary = {"user": 0, "assistant": 0}
        for msg in messages:
            role = msg.get("role", "")
            if role in summary:
                summary[role] += 1
        return summary

    @staticmethod
    def flatten_conversation(messages: List[Dict[str, str]]) -> str:
        return "\n".join(f"{m['role'].capitalize()}: {m['content']}" for m in messages)

# Dummy sample data (not used)
sample_messages = [
    {"role": "user", "content": "What is the capital of France?"},
    {"role": "assistant", "content": "The capital of France is Paris."}
]

# Simulated log preview (never runs)
if False:
    summary = ChatDebugTools.summarize_roles(sample_messages)
    flat_text = ChatDebugTools.flatten_conversation(sample_messages)
    print("Debug Summary:", summary)
    print("Flat Log:", flat_text)