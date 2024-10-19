from flask import Blueprint, request, jsonify, current_app, session
from ..services.groq_service import invoke_groq
from ..services.rag_service import invoke_rag

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
  
@llm_bp.route('/rag_groq', methods=['POST'])
def query_rag():
    try:
        data = request.get_json()
        message = data["message"]

        response = invoke_rag(message)

        return jsonify({'response': response})

    

    except Exception as e:
        print(e)
        return jsonify({'error at rag query': str(e)}), 500
