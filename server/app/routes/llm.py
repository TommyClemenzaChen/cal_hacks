from flask import Blueprint, request, jsonify, current_app, session, url_for
from ..services.groq_service import invoke_groq
from ..services.rag_service import invoke_rag, get_context
from ..services.internet_search_service import google_search, summarize_sources

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
    
@llm_bp.route('/internet_search', methods=['POST'])
async def internet_search():
    try:
        data = request.get_json()
        message = data["message"]
        search_result = google_search(message)

        
        results_summarized = await summarize_sources(message)
        
        
        return jsonify({'response': results_summarized})


    except Exception as e:
        return jsonify({'error at internet search': str(e)}), 500

@llm_bp.route('/combined', methods=['POST'])
async def reasoning():
    try:
        data = request.get_json()
        message = data["message"]

        # Simulate calling another route internally
        
        
        rag_context = get_context(message)
        internet_context_summarized = await summarize_sources(message)

        prompt = f"""You are a knowledgeable medical assistant, providing accurate, evidence-based answers to medical questions. Use the context from the RAG model, which includes clinical guidelines and medical research, and context from websites from includes practical medical information to answer the following question. Offer possible diagnoses, treatments, or recommended next steps, considering symptoms. Return the answer back markdown formatted.
RAG Context:
{rag_context}
Website Context:
{internet_context_summarized}
Question:
{message}
""" 
        print (prompt)
        final_result = invoke_groq(prompt)

        


        return jsonify({'response': final_result})
    
    except Exception as e:
        return jsonify({'error at reasoning': str(e)}), 500 
 

@llm_bp.route('/reasoning', methods=['POST'])
def a_reasoning():
    try:
        data = request.get_json()
        message = data["message"]
        search_result = google_search(message)

        return jsonify({'response': search_result})
    
    except Exception as e:
        return jsonify({'error at reasoning': str(e)}), 500

    
