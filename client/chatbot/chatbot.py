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

graph_builder.add_node("chatbot", chatbot)
graph_builder.add_edge(START, "chatbot")
graph_builder.add_edge("chatbot", END)


graph = graph_builder.compile()


def stream_graph_updates(user_input: str):    
    state = {"messages": [{"role": "user", "content": user_input}]}
    for event in graph.stream(state):
        for value in event.values():
            print("Assistant:", value["messages"][-1]["content"])

if __name__ == "__main__":
    while True:
        try:
            user_input = input("User: ")
            if user_input.lower() in ["quit", "exit", "q"]:
                print("Goodbye!")
                break

            stream_graph_updates(user_input)
        except Exception as e:
            print(f"An error occurred: {e}")
            break            




from datetime import datetime

class ChatSessionInfo:
    """Stores metadata about a chat session."""
    def __init__(self, session_id: str, user_id: str = "anonymous"):
        self.session_id = session_id
        self.user_id = user_id
        self.start_time = datetime.utcnow()
    
    def duration_seconds(self) -> float:
        return (datetime.utcnow() - self.start_time).total_seconds()

def format_messages(messages: List[Dict[str, str]]) -> str:
    """Format chat messages as a readable string."""
    return "\n".join(f"{msg['role'].capitalize()}: {msg['content']}" for msg in messages)

def dummy_logger(state: Dict):
    """Dummy logger that does nothing but illustrates possible future logging."""
    pass


sample_messages = [
    {"role": "user", "content": "What time is it?"},
    {"role": "assistant", "content": "I don't have a clock, but you can check your device!"}
]


if False:
    print("Formatted sample conversation:\n", format_messages(sample_messages))
