import os
import sys

import chromadb
from llama_index.core import Document, StorageContext, VectorStoreIndex
from llama_index.vector_stores.chroma import ChromaVectorStore
from llama_index.core.prompts import PromptTemplate
from llama_index.embeddings.jinaai import JinaEmbedding
from flask import current_app

sys.path.append("/Users/tommychen/cal_hacks/server/app/services")
from groq_service import invoke_groq

CHROMA_PATH = "app/data/chroma"


def _get_retriever(k = 3):
    try:
        JINA_AI_API_KEY = current_app.config["JINA_AI_API_KEY"]

        
        db = chromadb.PersistentClient(path=CHROMA_PATH)
        chroma_collection = db.get_or_create_collection("chroma_db")
        vector_store = ChromaVectorStore(chroma_collection=chroma_collection)

        embed_model = JinaEmbedding(
            api_key=JINA_AI_API_KEY,
            model="jina-embeddings-v3",
            
        )

        index = VectorStoreIndex.from_vector_store(
            vector_store,
            embedding_model = embed_model,
        )

        retriever = index.as_retriever(similarity_top_k = k)
        
        return retriever
    except Exception as e:
        print(f"Error at getting retrieval: {e}")

def invoke_rag(query_text: str):
    try:
        retriever = _get_retriever()
        retrieved_content = retriever.retrieve(query_text)

        # Extracting text from the selected nodes
        context = "Context"
        for content in retrieved_content:
            context += content.text + "\n"


        prompt = PromptTemplate(
        "Context information is below.\n"
        "---------------------\n"
        "{context_str}\n"
        "---------------------\n"
        "Given the context information and not prior knowledge, "
        "answer the query.\n"
        "Query: {query_str}\n"
        "Answer: "
        )
        formatted_prompt = prompt.format(context_str=context, query_str=query_text)
        
        response = invoke_groq(formatted_prompt)

        return response
    except Exception as e:
        print(f"Error at invoking rag: {e}")

if __name__ == "__main__":
    
    response = invoke_rag("What is this research paper about?")
    print(response)

