from flask import Flask, render_template
from flask_socketio import SocketIO, emit

async_mode = None
app = Flask(__name__, static_folder="static")
socket_ = SocketIO(app, async_mode=async_mode)

import enchant
d = enchant.Dict("en_US")

words = []

import random
import numpy as np
dice = np.array([["R", "I", "F", "O", "B", "X"],
                 ["I", "F", "E", "H", "E", "Y"],
                 ["D", "E", "N", "O", "W", "S"],
                 ["U", "T", "O", "K", "N", "D"],
                 ["H", "M", "S", "R", "A", "O"],
                 ["L", "U", "P", "E", "T", "S"],
                 ["A", "C", "I", "T", "O", "A"],
                 ["Y", "L", "G", "K", "U", "E"],
                 ["Qu", "B", "M", "J", "O", "A"],
                 ["E", "H", "I", "S", "P", "N"],
                 ["V", "E", "T", "I", "G", "N"],
                 ["B", "A", "L", "I", "Y", "T"],
                 ["E", "Z", "A", "V", "N", "D"],
                 ["R", "A", "L", "E", "S", "C"],
                 ["U", "W", "I", "L", "R", "G"],
                 ["P", "A", "C", "E", "M", "D"]])

die = []

def get_die():
    indi = [i for i in range(len(dice))]
    random.shuffle(indi)

    global die
    die = []
    for i in range(len(dice)):
        die.append(dice[indi[i]][random.randint(0,5)])

    return die

get_die()

@app.route("/")
def index():
    return render_template("index.html", sync_mode=socket_.async_mode)

@socket_.on("conn", namespace="/game")
def init_client():
    emit("initialization", {"die": die, "words": words})

@socket_.on("shuffle", namespace="/game")
def shuff():
    global words
    words = []
    get_die()
    emit("initialization", {"die": die, "words": words}, broadcast=True)

@socket_.on("submit", namespace="/game")
def submit(word):
    global words
    word = word["data"].lower()
    if word in words:
        return
    if d.check(word):
        words.append(word)
    emit("word_response",
         {"word": word, "valid": d.check(word)},
         broadcast=True)

if __name__ == "__main__":
    socket_.run(app, debug=True)
