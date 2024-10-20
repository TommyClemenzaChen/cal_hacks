import requests
from flask import current_app

def invoke_hyperbolic(query, model = "meta-llama/Meta-Llama-3.1-8B-Instruct"):

    url = "https://api.hyperbolic.xyz/v1/chat/completions"
    headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + current_app.config["HYPERBOLIC_API_KEY"]
    }
    data = {
        "messages": [
            {
                "role": "user",
                "content": query
            }
        ],
        "model": model,
        "max_tokens": 2048,
        "temperature": 0.7,
        "top_p": 0.9
    }
    
    response = requests.post(url, headers=headers, json=data)
    return response.json()['choices'][0]['message']['content']




