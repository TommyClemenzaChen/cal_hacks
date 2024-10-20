import requests
from flask import current_app


import base64
import requests
from io import BytesIO
from PIL import Image


def invoke_hyperbolic(query, model="meta-llama/Meta-Llama-3.1-8B-Instruct"):

    url = "https://api.hyperbolic.xyz/v1/chat/completions"
    headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + current_app.config["HYPERBOLIC_API_KEY"],
    }
    data = {
        "messages": [{"role": "user", "content": query}],
        "model": model,
        "max_tokens": 2048,
        "temperature": 0.7,
        "top_p": 0.9,
    }

    response = requests.post(url, headers=headers, json=data)
    return response.json()["choices"][0]["message"]["content"]


import requests

url = "https://api.hyperbolic.xyz/v1/completions"
headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0Y2hlbjE3NUB1Y3NjLmVkdSIsImlhdCI6MTcyOTMxMTMzOH0.v7V9OLCeBUoY-xB-kpXKQCuH4Q85nDOSNgA8hfgw4cI",
}


def encode_image(img):
    buffered = BytesIO()
    img.save(buffered, format="PNG")
    encoded_string = base64.b64encode(buffered.getvalue()).decode("utf-8")
    return encoded_string


def hyperbolic_image_query(img, prompt):
    # img = Image.open("path_to_your_image")
    print("I REACHED HYPERR")
    base64_img = encode_image(img)

    data = {
        "prompt": prompt,
        "images": [
            {
                "type": "image_url",
                "image_url": {
                    "url": f"data:image/jpeg;base64,{base64_img}",
                },
            }
        ],
        "model": "meta-llama/Llama-3.2-90B-Vision",
        "max_tokens": 2048,
        "temperature": 0.7,
        "top_p": 0.9,
    }

    response = requests.post(url, headers=headers, json=data)
    return response.json()
