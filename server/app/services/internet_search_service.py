import requests
from flask import current_app
from dotenv import load_dotenv
import os

import time

import sys

sys.path.append(os.path.join(os.path.dirname(__file__), ".."))
from .groq_service import invoke_groq

load_dotenv()


async def summarize_sources(query: str):
    try:

        search_result = google_search(query)

        prompt = f"""
Gather all the important information from the scraped text and summarize it. For each source, provide three to five sentences to summarize the important information.
Relate the information to the query: "{query}"

Texts:
{search_result}
"""

        results_summarized = invoke_groq(prompt)

        return results_summarized

    except Exception as e:
        print(f"Error at summarizing internet sources: {e}")


# Will call the search helper, get the links, scrape it and returns the combined text
def google_search(query):
    try:

        google_search_results = google_search_api(query)

        combined_data = ""
        for i, result in enumerate(google_search_results, start=1):
            text = scrape_site(result["link"])
            combined_data += f"\n\nSource {i}: {result['title']}\n{text}"

        return combined_data

    except Exception as e:
        print(f"Error at internet search service: {e}")


# def chunk_embed_text(text):
def scrape_site(url: str) -> str:
    response = requests.get("https://r.jina.ai/" + url)
    return response.text


# Does the searching
def google_search_api(query, num_results=1):
    url = f"https://www.googleapis.com/customsearch/v1"
    API_KEY = os.getenv("GCP_API_KEY")
    CSE_ID = os.getenv("CSE_ID")
    params = {
        "q": query,  # The search query
        "key": API_KEY,  # Your API key
        "cx": CSE_ID,  # Your Custom Search Engine ID
        "num": num_results,  # Number of results to return
    }

    response = requests.get(url, params=params)

    if response.status_code == 200:
        search_results = response.json()
        return search_results.get("items", [])
    else:
        print("Error:", response.status_code, response.text)
        return []


if __name__ == "__main__":

    start_time = time.time()
    query = "I currently have a cold, what should i do?"
    results = google_search(query)
    prompt = f"""
Gather all the important information from the above links and summarize it in as few sentences as possible, but make sure to include all the important details.
Relate the information to the query: "{query}"
"""

    # Print URLs of the results
    for i, result in enumerate(results, start=1):
        text = scrape_site(result["link"])
        print(f"{i}. {result['title']}: {result['link']}, length: {len(text)}")
        prompt += f"\n\nSource {i}: {result['title']}\n{text}"
