from flask import Blueprint, request, jsonify
import aiohttp
from config import DEEPGRAM_API_KEY
from flask_cors import CORS

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
