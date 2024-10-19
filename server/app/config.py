from dotenv import load_dotenv
import os 
# import json

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
JINA_AI_API_KEY = os.getenv("JINA_AI_API_KEY")

