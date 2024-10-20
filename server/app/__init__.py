from flask import Flask

from flask_cors import CORS
from .routes.llm import llm_bp
from .routes.images import images_bp
from .routes.voices import voices_bp
from .services.rag_service import get_retriever

import logging

import os


def create_app():
    app = Flask(__name__)

    CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})

    app.config.from_pyfile("config.py")
    app.config["JINA_AI_API_KEY"] = os.environ.get("JINA_AI_API_KEY")

    app.config["Retriever"] = get_retriever()

    app.register_blueprint(llm_bp, url_prefix="/api/llm")
    app.register_blueprint(images_bp, url_prefix="/api/images")
    app.register_blueprint(voices_bp, url_prefix="/api/voices")
    

    return app
