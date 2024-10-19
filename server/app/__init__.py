from flask import Flask

from flask_cors import CORS
from .routes.llm import llm_bp

import logging

import os


def create_app():
    app = Flask(__name__)

    CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})

    app.config.from_pyfile("config.py")
    app.config['JINA_AI_API_KEY'] = os.getenv("JINA_AI_API_KEY")

    app.register_blueprint(llm_bp, url_prefix="/api/llm")

    return app
