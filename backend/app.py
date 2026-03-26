from flask import Flask

app = Flask(__name__)

@app.route("/")
def home():
	return "Hello, world!"

@app.route("/health")
def health():
	return {"status": "ok"}


@app.route("/eli")
def eli():
	return {"status": "stinky"}

if __name__ == "__main__":
	app.run(debug=True)