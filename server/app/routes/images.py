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
    if "file" not in request.json and "text" not in request.json:
        return jsonify({"error": "No file or text provided"}), 400

    if "file" in request.json:
        file_data = request.json["file"]
        # Check if the file data is a valid base64 string
        if file_data.startswith("data:image/"):
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
            return jsonify({"message": "File uploaded successfully"}), 200
        else:
            return jsonify({"error": "Invalid file format"}), 400

    if "text" in request.json:
        text = request.json["text"]
        print(text)
        # Process the text here (e.g., save to a file or database)
        return jsonify({"message": "Text uploaded successfully"}), 200

    image_path = "./server/uploads/image.png"

    print(hyperbolic_image_query(image_path, text))

    return jsonify({"error": "Unknown error occurred"}), 500
