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
let selectedOrder = [];

let found_words = new Set();  // TODO RESET WITH SHUFFLE

let dictionary = new Typo("en_US", false, false,
                          { dictionaryPath: "/static/Typo.js-master/typo/dictionaries" });

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
                            if (selectedOrder.length != 0) {
                                lastSelected = parseInt(dieCoords[selectedOrder[selectedOrder.length - 1]]);

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
                            selectedOrder.push(i);
                        } else if (selectedOrder[selectedOrder.length - 1] == i) {
                            document.getElementById(dieCoords[i]).classList.remove("selectedDie");
                            word = word.slice(0, word.length-die[i].length);
                            document.getElementById("word").innerHTML = (
                                document.getElementById("word").innerHTML.slice(0, word.length)
                            );
                            selected[i] = false;
                            selectedOrder.pop();
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

        socket.on("receiveShuffle", function (msg) {
            die = msg["die"];
            words = msg["words"];
            resetWord();

            for (let i = 0; i < dieCoords.length; i++) {
                document.getElementById(dieCoords[i]).innerHTML = die[i];
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
            }
        );

        document.getElementById("submit").addEventListener("click",
            function (event) {
                let is_spelled_correctly = dictionary.check(word);

                if (is_spelled_correctly) {
                    validWord(word);
                    return true;
                }

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

        function validWord(word) {
            document.getElementById("wordListInterior").innerHTML = (
                "<p class=wordListElement>" + word + "</p>" +
                document.getElementById("wordListInterior").innerHTML);
        }

        /*
        socket.on("word_response", function(msg) {
            if (msg.valid) {
                document.getElementById("wordListInterior").innerHTML = (
                    "<p class=wordListElement>" + msg.word + "</p>" +
                    document.getElementById("wordListInterior").innerHTML);
            }
        });
        */

    }

    function resetWord() {
        for (let i = 0; i < dieCoords.length; i++) {
            document.getElementById(dieCoords[i]).classList.remove("selectedDie");
        }

        word = "";
        document.getElementById("word").innerHTML = word;
        selected = [false, false, false, false,
                    false, false, false, false,
                    false, false, false, false,
                    false, false, false, false];
        selectedOrder = [];
    }
})(window, document, undefined);
