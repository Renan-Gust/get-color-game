class GetColorGame {
    container = document.querySelector(".container");
    colors = ["red", "yellow", "blue", "green", "purple"];
    numberOfColorsToFill = 5;
    tubes = this.colors.length;
    extraTubes = 2;
    selectedColor = null;
    nextSelectedColor = null;
    tubesElement = null;
    tubeSelectedClass = "selected";

    ReturnColorsByTube(index){
        const colors = [];

        for(let i = 0; i < 5; i++){
            colors.push(this.colors[index])
        }

        return colors;
    }

    shuffleColors(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }

        return array;
    }

    separateTheRandomColors(colors){
        const groupedColors = colors.reduce((acc, curr) => acc.concat(curr), []);
        const shuffledColors = this.shuffleColors(groupedColors);

        const separateTheColorsArray = [];
        for (let i = 0; i < shuffledColors.length; i += 5) {
            separateTheColorsArray.push(shuffledColors.slice(i, i + 5));
        }

        return separateTheColorsArray;
    }

    groupRandomColors() {
        const randomColorsGrouped = [];

        for (let i = 0; i < this.tubes; i++) {
            const colors = this.ReturnColorsByTube(i);
            randomColorsGrouped.push(colors);
        }

        return randomColorsGrouped;
    }

    fillTubes(){
        const allColors = this.separateTheRandomColors(this.groupRandomColors());

        for (let i = 0; i < this.tubes; i++) {
            const tube = document.createElement("div");
            tube.className = "tube";

            const randomColors = allColors[i];
        
            for (let j = 0; j < this.numberOfColorsToFill; j++) {
                const colorDiv = document.createElement("div");
                colorDiv.className = `color ${randomColors[j]}`;
                colorDiv.setAttribute("data-color", randomColors[j]);
                tube.appendChild(colorDiv);
            }
        
            this.container.appendChild(tube);
        }
    }

    fillExtraTubes(){
        for (let i = 0; i < this.extraTubes; i++) {
            const emptyTube = document.createElement("div");
            emptyTube.className = "tube";
            this.container.appendChild(emptyTube);
        }        
    }

    moveColor(tube){
        const colors = tube.querySelectorAll(".color");

        if (colors.length > 0 && !this.selectedColor) {
            this.deselectTube();

            tube.classList.add(this.tubeSelectedClass);
            this.selectedColor = colors[0];

            const nextColor = tube.querySelector(".color + .color");
            if(nextColor){
                const nextColorName = nextColor.getAttribute("data-color");
                const selectedColorName = this.selectedColor.getAttribute("data-color");

                if(selectedColorName === nextColorName){
                    this.nextSelectedColor = nextColor;
                }
            }
        } else if (colors.length < 5 && this.selectedColor) {
            tube.insertBefore(this.selectedColor, tube.firstChild);
            this.selectedColor = null;

            if(this.nextSelectedColor){
                tube.insertBefore(this.nextSelectedColor, tube.firstChild);
                this.nextSelectedColor = null;
            }

            this.deselectTube();
        } else if(this.selectedColor && tube.classList.contains(this.tubeSelectedClass)){
            tube.classList.remove(this.tubeSelectedClass);
            this.selectedColor = null;
        }
    }

    deselectTube(){
        this.tubesElement.forEach(tube => tube.classList.remove(this.tubeSelectedClass));
    }

    init(){
        this.fillTubes();
        this.fillExtraTubes();

        this.tubesElement = document.querySelectorAll(".tube");

        this.tubesElement.forEach((tube) => {
            tube.addEventListener("click", () => this.moveColor(tube));
        });
    }
}

const initGame = new GetColorGame();
initGame.init();