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

function shuffle(array) {
  // taken from: https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
  // August 19, 2022

  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

(function(window, document, undefined) {
    window.onload = init;

    function init() {
        let arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
        arr = shuffle(arr);
        console.log(arr);
        for (let i = 0; i < die.length; i++) {
            die[i] = dice[arr[i]][Math.floor(Math.random()*5)];
        }
    
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
                        document.getElementById("word").innerHTML = word;
                        selected[i] = true;
                        lastSelected = dieCoords[i];
                    }
                }
            );
        }

        document.getElementById("reset").addEventListener("click",
            function (event) {
                resetWord();
                word = "";
                lastSelected = "";
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
