from App import app
import os
if __name__ == "__main__":
    # Fetch the environment variable (so it works on Heroku):
    app.run(port=int(os.environ.get("PORT", 5000)))