from flask import Flask

from flask_cors import CORS
from .routes.llm import llm_bp
import logging

def create_app():
    app = Flask(__name__)

    app.config.from_pyfile('config.py')

    app.register_blueprint(llm_bp, url_prefix='/api/llm')

    return app