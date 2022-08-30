let dice = [["R", "I", "F", "O", "B", "X"],
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
            ["P", "A", "C", "E", "M", "D"]];

let die = ["A", "B", "C", "D",
           "E", "F", "G", "H",
           "I", "J", "K", "L",
           "M", "N", "O", "P"];

let dieCoords = ["00", "01", "02", "03",
                 "10", "11", "12", "13",
                 "20", "21", "22", "23",
                 "30", "31", "32", "33"];

let selected = [false, false, false, false,
                false, false, false, false,
                false, false, false, false,
                false, false, false, false];

let word = "";
let lastSelected = "";

(function(window, document, undefined) {
    window.onload = init;

    function init() {
        namespace = "/game";
        var socket = io(namespace);

        // get initial data on successful connection
        socket.emit("conn");
        socket.on("initialization", function(msg) {
            die = msg["die"];

            for (let i = 0; i < dieCoords.length; i++) {
                document.getElementById(dieCoords[i]).innerHTML = die[i];
                document.getElementById(dieCoords[i]).addEventListener(
                    "click", function (event) {
                        if (!selected[i]) {
                            if (lastSelected != "") {
                                lastSelected = parseInt(lastSelected);

                                if (!(dieCoords[i] == lastSelected-10
                                   || dieCoords[i] == lastSelected+10
                                   || dieCoords[i] == lastSelected-1
                                   || dieCoords[i] == lastSelected+1
                                   || dieCoords[i] == lastSelected-10-1
                                   || dieCoords[i] == lastSelected-10+1
                                   || dieCoords[i] == lastSelected+10-1
                                   || dieCoords[i] == lastSelected+10+1)) {
                                    return false;
                                }
                            }

                            document.getElementById(dieCoords[i]).classList.add("selectedDie");
                            word += die[i];
                            document.getElementById("word").innerHTML += die[i];
                            selected[i] = true;
                            lastSelected = dieCoords[i];
                        }
                    }
                );
            }
        });

        document.getElementById("reset").addEventListener("click",
            function (event) {
                resetWord();
                word = "";
                lastSelected = "";
                document.getElementById("word").innerHTML = word;
            }
        );

        document.getElementById("submit").addEventListener("click",
            function (event) {
                socket.emit("submit", {data: word});
                return false;
            }
        );

        document.getElementById("shuffle").addEventListener("click",
            function (event) {
                if (window.confirm("Are you sure you want to shuffle?")) {
                    socket.emit("shuffle");
                }
                return false;
            }
        );

        socket.on("word_response", function(msg) {
            if (msg.valid) {
                document.getElementById("wordListInterior").innerHTML = (
                    "<p class=wordListElement>" + msg.word + "</p>" +
                    document.getElementById("wordListInterior").innerHTML);
            }
        });

    }

    function resetWord() {
        for (let i = 0; i < dieCoords.length; i++) {
            document.getElementById(dieCoords[i]).classList.remove("selectedDie");
        }

        selected = [false, false, false, false,
                    false, false, false, false,
                    false, false, false, false,
                    false, false, false, false];
    }
})(window, document, undefined);
