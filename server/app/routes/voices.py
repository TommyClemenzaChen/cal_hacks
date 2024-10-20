from flask import Blueprint, request, jsonify
import aiohttp
from config import DEEPGRAM_API_KEY
from flask_cors import CORS
from ..services.groq_service import (
    invoke_groq,
)  # Import the function to use for AI response


from ..services.rag_service import invoke_rag  # Import if needed for context


voices_bp = Blueprint("voices", __name__)
CORS(voices_bp, supports_credentials=True)

DEEPGRAM_API_URL = "https://api.deepgram.com/v1/listen"


@voices_bp.route("/transcribe", methods=["POST"])
async def transcribe():
    if "audio" not in request.files:
        return jsonify({"error": "No audio file provided"}), 400

    audio_file = request.files["audio"]

    headers = {
        "Authorization": f"Token {DEEPGRAM_API_KEY}",
    }

    async with aiohttp.ClientSession() as session:
        async with session.post(
            DEEPGRAM_API_URL, data=audio_file.read(), headers=headers
        ) as response:
            if response.status == 200:
                result = await response.json()
                transcribed_text = result["results"]["channels"][0]["alternatives"][0][
                    "transcript"
                ]
                print(transcribed_text)
                return jsonify({"transcribed_text": transcribed_text})
            else:
                return jsonify({"error": "Failed to transcribe audio"}), response.status


@voices_bp.route("/respond", methods=["POST"])
async def respond():
    user_input = request.json.get("text")
    if not user_input:
        return jsonify({"error": "No input text provided"}), 400

    try:
        response = invoke_groq(
            user_input
            + ". Write this as if you were a professional medical advise giver and that your words can heavily impact other's lives.Stop before 300 tokens. Follow Markdown formatting with # for title, then numbered h2s for subtitle and bullet points for the infornation. Return the output in proper markdown formatting. Double check to ensure you closed all markdown tags. Double check to answer responses in complete sentences. There should not be any incomplete sentences in the response. Things like undefined and null should not be in the response. Double check that each sentence is a proper english sentence. If you start a bullet point, YOU MUST finish it with an english sentence. If you can't finish a sentence or bulletpoint, dont write it and end earlier. If you can't finish a sentence, don't write it and end earlier. If you can't finish a bulletpoint, don't write it and end earlier. If you can't finish a sentence, don't write it and end earlier. If you can't finish a bulletpoint, don't write it and end earlier. If you can't finish a sentence, don't write it and end earlier. The words aundefined, undefined, or **undefined should not be in the input, if they do, don't show that sentence or bullet point.",
        )
        concise_response = response

        print("AI Response:", concise_response)
        return jsonify({"response_text": concise_response})

    except Exception as e:
        print("Error in AI response:", str(e))
        return jsonify({"error": "Failed to generate response"}), 500
