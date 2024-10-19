
from groq import Groq
from flask import current_app


def invoke_groq(prompt, model = "llama-3.1-8b-instant", json_mode = False):

    groq_client = Groq(api_key=current_app.config["GROQ_API_KEY"])
    try:
        kwargs = {
            "model": model,
            "messages": [{"role": "user", "content": prompt}],
            "max_tokens": 300
        }
        if json_mode:
            kwargs["response_format"] = {"type": "json_object"}

        response = groq_client.chat.completions.create(**kwargs)
        return response.choices[0].message.content

    except Exception as e:
        print(f"Error at invoking groq:  {e}")