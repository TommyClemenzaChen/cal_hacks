import os
import sys

import chromadb
from llama_index.core import Document, StorageContext, VectorStoreIndex
from llama_index.vector_stores.chroma import ChromaVectorStore
from llama_index.core.prompts import PromptTemplate
from llama_index.embeddings.jinaai import JinaEmbedding
from flask import current_app

sys.path.append(os.path.join(os.path.dirname(__file__), ".."))

from .groq_service import invoke_groq

from dotenv import load_dotenv


CHROMA_PATH = "app/data/chroma"


def get_retriever(k=3):
    try:
        load_dotenv()
        JINA_AI_API_KEY = os.getenv("JINA_AI_API_KEY")

        db = chromadb.PersistentClient(path=CHROMA_PATH)
        chroma_collection = db.get_or_create_collection("chroma_db")
        vector_store = ChromaVectorStore(chroma_collection=chroma_collection)

        embed_model = JinaEmbedding(
            api_key=JINA_AI_API_KEY,
            model="jina-embeddings-v3",
        )

        index = VectorStoreIndex.from_vector_store(
            vector_store,
            embedding_model=embed_model,
        )

        retriever = index.as_retriever(similarity_top_k=k)
        print("retriever created")
        return retriever
    except Exception as e:
        print(f"Error at getting retrieval: {e}")


def invoke_rag(query_text: str):
    try:
        retriever = current_app.config["Retriever"]
        retrieved_content = retriever.retrieve(query_text)

        # Extracting text from the selected nodes
        context = "Context"
        for content in retrieved_content:
            context += content.text + "\n"

        prompt = """
You are a knowledgeable medical assistant, providing accurate, evidence-based answers to medical questions. Use the context from the RAG model, which includes clinical guidelines and medical research, to answer the following question. Offer possible diagnoses, treatments, or recommended next steps, considering symptoms. Ensure that the answer is returned back in completely, and not cut off the answer. Return the answer back markdown formatted properly, follow markdown rules and ensure that if you start formatting you end it. Double check the answer that you follow these rules before returning.
Context:
{context_str}
Question:
{query_str}
"""

        formatted_prompt = prompt.format(context_str=context, query_str=query_text)

        response = invoke_groq(formatted_prompt)

        return response
    except Exception as e:
        print(f"Error at invoking rag: {e}")


if __name__ == "__main__":

    response = invoke_rag("What is this research paper about?")
    print(response)
