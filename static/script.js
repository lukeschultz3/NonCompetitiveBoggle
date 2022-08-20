

let dieCoords = ["00", "01", "02", "03",
                 "10", "11", "12", "13",
                 "20", "21", "22", "23",
                 "30", "31", "32", "33"];

let word = "";

(function(window, document, undefined) {
    window.onload = init;

    function init() {
        for (let i = 0; i < dieCoords.length; i++) {
            document.getElementById(dieCoords[i]).addEventListener(
                "click", function (event) {
                    document.getElementById(dieCoords[i]).classList.add("selectedDie");
                }
            );
        }
    }

    function resetWord() {
        for (let i = 0; i < dieCoords.length; i++) {
            document.getElementById(dieCoords[i]).classList.remove("selectedDie");
        }
    }
})(window, document, undefined);
