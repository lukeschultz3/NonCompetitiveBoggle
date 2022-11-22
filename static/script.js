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

dice_set = [["R", "I", "F", "O", "B", "X"],
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

let dice = [];

// taken from https://www.geeksforgeeks.org/how-to-shuffle-an-array-using-javascript/
// November 22, 2022
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));

        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }

    return array;
}

function get_dice() {
    indi = [];
    for (let i = 0; i < dice_set.length; i++) {
        indi.push(i);
    }

    indi = shuffleArray(indi);

    let dice = []
    for (let i = 0; i < dice_set.length; i++) {
        dice[i] = dice_set[indi[i]][Math.floor(Math.random()*6)];
    }

    return dice;
}

dice = get_dice();


(function(window, document, undefined) {
    window.onload = init;

    function init() {
        //namespace = "/game";
        //var socket = io(namespace);

        for (let i = 0; i < dieCoords.length; i++) {
            document.getElementById(dieCoords[i]).innerHTML = dice[i];
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
                        word += dice[i];
                        document.getElementById("word").innerHTML += dice[i];
                        selected[i] = true;
                        selectedOrder.push(i);
                    } else if (selectedOrder[selectedOrder.length - 1] == i) {
                        document.getElementById(dieCoords[i]).classList.remove("selectedDie");
                        word = word.slice(0, word.length-dice[i].length);
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

        document.getElementById("reset").addEventListener("click",
            function (event) {
                resetWord();
            }
        );

        document.getElementById("submit").addEventListener("click",
            function (event) {
                if (found_words.has(word)) {
                    return false;
                }

                let is_spelled_correctly = dictionary.check(word);

                if (is_spelled_correctly) {
                    found_words.add(word);
                    validWord(word);
                    return true;
                }

                return false;
            }
        );

        document.getElementById("shuffle").addEventListener("click",
            function (event) {
                if (window.confirm("Are you sure you want to shuffle?")) {
                    resetWord();
                    found_words = new Set();
                    dice = get_dice();

                    for (let i = 0; i < dieCoords.length; i++) {
                        document.getElementById(dieCoords[i]).innerHTML = dice[i];
                    }

                    document.getElementById("wordListInterior").innerHTML = "";

                    return true;
                }
                return false;
            }
        );

        function validWord(word) {
            document.getElementById("wordListInterior").innerHTML = (
                "<p class=wordListElement>" + word + "</p>" +
                document.getElementById("wordListInterior").innerHTML);
        }
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
