from flask import Blueprint, request, jsonify, current_app, session, url_for
from ..services.groq_service import invoke_groq
from ..services.rag_service import invoke_rag, get_context
from ..services.internet_search_service import google_search, summarize_sources
# from ..services.med_bot import med_gcp_query
from ..services.hyperbolic_service import invoke_hyperbolic
import time

from ..services.email_services import send_email



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

        diagnosis_prompt = f"""
You are a knowledgeable medical assistant, providing accurate, evidence-based answers to medical questions. Use the context from the RAG model, which includes clinical guidelines and medical research, and context from websites that include practical medical information to answer the following question. 

First, determine the severity of the issue on a scale from 1 to 10, with 1 being harmless and 10 being a medical emergency (e.g., call 911). 

Then, structure your answer into the following sections, returning the answer in markdown format:

### 1. Severity of the Diagnosis
Provide a summary of the severity rating (1-10) and a brief explanation.

### 2. Possible Diagnoses
List possible diagnoses, each with a brief description.

### 3. Possible Treatments / Next Steps
Suggest potential treatments or recommended next steps, using bullet points for clarity.

### 4. Additional Advice
Offer any other relevant advice or considerations.

RAG Context:
{rag_context}

Website Context:
{internet_context_summarized}

Question:
{message}
"""

        
       
        diagnosis_result = invoke_hyperbolic(diagnosis_prompt, model = "meta-llama/Meta-Llama-3.1-70B-Instruct")
        print(f"Time taken to get final result: {time.time() - start_time}")
        
        email_prompt = f"""You are a knowledgeable medical assistant. Given the diagnosis and the user query, send a three to five sentence email, the user can send to their doctor to get better info. Treat the diagnosis as advice rather than actual stuff.
Diagnosis:
{diagnosis_result}
User Query:
{message}
"""
        
        email_result = invoke_groq(email_prompt)

        send_email(body = email_result)


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

@llm_bp.route('/email', methods=['POST'])
def email():
    try:
        data = request.get_json()
        message = data["message"]
        send_email(body=message)

        return jsonify({'status': 'a'})

    except Exception as e:
        print('error in email{e}')

    
