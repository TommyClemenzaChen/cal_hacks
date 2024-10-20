from flask import Blueprint, request, jsonify, current_app, session, url_for
from ..services.groq_service import invoke_groq
from ..services.rag_service import invoke_rag, get_context
from ..services.internet_search_service import google_search, summarize_sources
# from ..services.med_bot import med_gcp_query
from ..services.hyperbolic_service import invoke_hyperbolic
import time

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
  
@llm_bp.route('/hyperbolic', methods=['POST'])
def query_hyperbolic():
  try:
      data = request.get_json()
      message = data["message"]

      response = invoke_hyperbolic(message)

      print(response)
      
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

        start_time = time.time()
        data = request.get_json()
        message = data["message"]

        # Simulate calling another route internally
        
        
        rag_context = get_context(message)
        print(f"Time taken to get context: {time.time() - start_time}")
        internet_context_summarized = await summarize_sources(message)
        print(f"Time taken to get internet context: {time.time() - start_time}")

        diagnosis_prompt = f"""You are a knowledgeable medical assistant, providing accurate, evidence-based answers to medical questions. Use the context from the RAG model, which includes clinical guidelines and medical research, and context from websites from includes practical medical information to answer the following question. First determine the severity of the issue from 1 - 10 with 1 being harmless to 10 being call 911. Discuss possible diagnoses, treatments, or recommended next steps, considering the symptoms. Return the answer back markdown formatted.
RAG Context:
{rag_context}
Website Context:
{internet_context_summarized}
Question:
{message}
""" 
        
       
        diagnosis_result = invoke_groq(diagnosis_prompt, model = "llama-3.1-70b-versatile")
        print(f"Time taken to get final result: {time.time() - start_time}")
        
        email_prompt = f"""You are a knowledgeable medical assistant. Given the diagnosis and the user query, send a three to five sentence email, the user can send to their doctor to get better info.
Diagnosis:
{diagnosis_result}
User Query:
{message}
"""
        email_result = invoke_groq(email_prompt)


        return jsonify({'diagnosis': diagnosis_result, 'email': email_result})
    
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
    
# @llm_bp.route('/gcp', methods=['POST'])
# def gcp():
#     try:
#         data = request.get_json()
#         message = data["message"]
#         response = med_gcp_query(message)

#         return jsonify({'response': response})
#     except Exception as e:
#         return jsonify({'error at gcp': str(e)}),

    
