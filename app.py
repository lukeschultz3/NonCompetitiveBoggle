from flask import Flask, render_template
from flask_socketio import SocketIO, emit

async_mode = None
app = Flask(__name__, static_folder="static")
socket_ = SocketIO(app, async_mode=async_mode)

import enchant
d = enchant.Dict("en_US")

words = []


@app.route("/")
def index():
    global words
    words = []
    return render_template("index.html", sync_mode=socket_.async_mode)


@socket_.on("submit", namespace="/game")
def submit(word):
    word = word["data"]
    if word in words:
        return
    if d.check(word):
        words.append(word)
    emit("word_response",
         {"word": word, "valid": d.check(word)},
         broadcast=True)

if __name__ == "__main__":
    socket_.run(app, debug=True)
