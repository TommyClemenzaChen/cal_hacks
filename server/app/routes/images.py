from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
import os
import base64
from ..services.hyperbolic_service import hyperbolic_image_query

images_bp = Blueprint("images", __name__)

UPLOAD_FOLDER = "uploads"
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif"}


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


@images_bp.route("/upload", methods=["POST"])
def upload_file():
    # Ensure both file and text are present in the request
    if "file" not in request.json or "text" not in request.json:
        return jsonify({"error": "Both file and text must be provided"}), 400

    file_data = request.json["file"]
    text = request.json["text"]
    print(text)

    # Check if the file data is a valid base64 string
    if not file_data.startswith("data:image/"):
        return jsonify({"error": "Invalid file format"}), 400

    # Extract the base64 string and decode it
    header, encoded = file_data.split(",", 1)
    file_bytes = base64.b64decode(encoded)

    # Create a filename and save the file
    filename = secure_filename("image.png")  # You can customize the filename
    if not os.path.exists(UPLOAD_FOLDER):
        os.makedirs(UPLOAD_FOLDER)
    with open(os.path.join(UPLOAD_FOLDER, filename), "wb") as f:
        f.write(file_bytes)

    print(f"File saved as {filename}")

    # Process the uploaded image
    image_path = os.path.join(UPLOAD_FOLDER, filename)  # Use the saved filename

    # Add error handling to check if file exists
    if not os.path.exists(image_path):
        return jsonify({"error": "Image file not found"}), 404

    try:
        # Load the image using PIL
        from PIL import Image

        img = Image.open(image_path)  # Load the image
        print("image loaded")
        result = hyperbolic_image_query(img, text)  # Pass the image object
        print(result)
        return (
            jsonify({"message": "File uploaded successfully", "query_result": result}),
            200,
        )
    except Exception as e:
        print(f"Error in hyperbolic_image_query: {str(e)}")
        return jsonify({"error": "Failed to process image query"}), 500
