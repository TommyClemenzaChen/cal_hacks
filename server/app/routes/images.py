from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
import os

images_bp = Blueprint("images", __name__)

UPLOAD_FOLDER = "uploads"
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif"}


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


@images_bp.route("/upload", methods=["POST"])
def upload_file():
    if "file" not in request.files and "text" not in request.form:
        return jsonify({"error": "No file or text provided"}), 400

    if "file" in request.files:
        file = request.files["file"]
        if file.filename == "":
            return jsonify({"error": "No selected file"}), 400
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            if not os.path.exists(UPLOAD_FOLDER):
                os.makedirs(UPLOAD_FOLDER)
            file.save(os.path.join(UPLOAD_FOLDER, filename))
            print(file)
            return jsonify({"message": "File uploaded successfully"}), 200
        else:
            return jsonify({"error": "Invalid file type"}), 400

    if "text" in request.form:
        text = request.form["text"]
        print(text)
        # Process the text here (e.g., save to a file or database)
        return jsonify({"message": "Text uploaded successfully"}), 200

    return jsonify({"error": "Unknown error occurred"}), 500
