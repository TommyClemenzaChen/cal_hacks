from app import create_app

# Create the Flask application
app = create_app()

# Entry point of the application
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)