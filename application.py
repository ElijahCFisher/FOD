from flask import Flask, render_template
app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == "__main__":
    app.run("0.0.0.0", 5001, app, use_debugger=True, use_reloader=True)