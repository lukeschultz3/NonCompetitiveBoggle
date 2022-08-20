
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

(function(window, document, undefined) {
    window.onload = init;

    function init() {
        for (let i = 0; i < dieCoords.length; i++) {
            document.getElementById(dieCoords[i]).addEventListener(
                "click", function (event) {
                    if (!selected[i]) {
                        document.getElementById(dieCoords[i]).classList.add("selectedDie");
                        word += die[i];
                        document.getElementById("word").innerHTML = word;
                        selected[i] = true;
                    }
                }
            );
        }

        document.getElementById("reset").addEventListener("click",
            function (event) {
                resetWord();
                word = "";
                document.getElementById("word").innerHTML = word;
            }
        );
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
