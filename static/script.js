let die = ["", "", "", "",
           "", "", "", "",
           "", "", "", "",
           "", "", "", ""];

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
            words = msg["words"];

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

            document.getElementById("wordListInterior").innerHTML = "";
            for (let i = 0; i < words.length; i++) {
                document.getElementById("wordListInterior").innerHTML = (
                    "<p class=wordListElement>" + words[i] + "</p>" +
                    document.getElementById("wordListInterior").innerHTML);
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
