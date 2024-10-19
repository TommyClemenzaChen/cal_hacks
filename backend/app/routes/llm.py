from flask import Blueprint, request, jsonify, current_app, session
from ..services.groq_service import invoke_groq

# Create a blueprint for google drive routes
llm_bp = Blueprint('llm', __name__)

@llm_bp.route('/groq', methods=['POST'])
def query_groq():
  try:
      data = request.get_json()
      message = data["message"]

      response = invoke_groq(message)
      
      return jsonify({'response': response})
  except Exception as e:
      return jsonify({'error at query': str(e)}), 500
