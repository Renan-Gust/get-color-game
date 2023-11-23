class GetColorGame {
    containerTubes = document.querySelector(".container .tubes");
    colors = ["red", "yellow", "blue", "green", "purple"];
    numberOfColorsToFill = 5;
    tubes = this.colors.length;
    extraTubes = 2;
    selectedColor = null;
    nextSelectedColor = null;
    tubesElement = null;
    tubeSelectedClass = "selected";
    currentLevel = null;
    passedTheLevel = false;

    ReturnColorsByTube(index){
        const colors = [];

        for(let i = 0; i < this.numberOfColorsToFill; i++){
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
        for (let i = 0; i < shuffledColors.length; i += this.numberOfColorsToFill) {
            separateTheColorsArray.push(shuffledColors.slice(i, i + this.numberOfColorsToFill));
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
        for (let i = 0; i < this.tubes; i++) {
            const tube = document.createElement("div");
            tube.className = "tube";

            const randomColors = this.currentLevel.allColors[i];
        
            for (let j = 0; j < this.numberOfColorsToFill; j++) {
                const colorDiv = document.createElement("div");
                colorDiv.className = `color ${randomColors[j]}`;
                colorDiv.setAttribute("data-color", randomColors[j]);
                tube.appendChild(colorDiv);
            }
        
            this.containerTubes.appendChild(tube);
        }
    }

    fillExtraTubes(){
        for (let i = 0; i < this.currentLevel.extraTubes; i++) {
            const emptyTube = document.createElement("div");
            emptyTube.className = "tube";
            this.containerTubes.appendChild(emptyTube);
        }        
    }

    selectColor(tube){
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
        } else if (colors.length < this.numberOfColorsToFill && this.selectedColor) {
            if(colors.length === 0){
                this.transferColor(tube);
            } else{
                const selectedColorName = this.selectedColor.getAttribute("data-color");
                const firstColorOfTheTubeReceivingTheTransfer = colors[0].getAttribute("data-color");

                if(selectedColorName === firstColorOfTheTubeReceivingTheTransfer){
                    this.transferColor(tube);
                }
            }
        } else if(this.selectedColor && tube.classList.contains(this.tubeSelectedClass)){
            tube.classList.remove(this.tubeSelectedClass);
            this.selectedColor = null;
        }
    }

    transferColor(tube){
        tube.insertBefore(this.selectedColor, tube.firstChild);
        this.selectedColor = null;

        if(this.nextSelectedColor){
            tube.insertBefore(this.nextSelectedColor, tube.firstChild);
            this.nextSelectedColor = null;
        }

        this.deselectTube();
        this.checkIfPassedTheLevel();
    }

    deselectTube(){
        this.tubesElement.forEach(tube => tube.classList.remove(this.tubeSelectedClass));
    }

    generateLevel(){
        this.currentLevel = JSON.parse(localStorage.getItem("getColorGame"));
        const allColors = this.separateTheRandomColors(this.groupRandomColors());

        const info = {
            allColors,
            extraTubes: this.extraTubes
        };

        if(!this.currentLevel){
            info.level = 1;
        }

        if(this.passedTheLevel){
            info.level = this.currentLevel.level + 1;
            this.refresh();
        }

        this.currentLevel = localStorage.setItem("getColorGame", JSON.stringify(info)); 

        this.fillTubes();
        this.fillExtraTubes();

        this.passedTheLevel = false;
    }

    showLevel(){
        const levelElement = document.querySelector(".container .info h1");
        levelElement.textContent = `Level ${this.currentLevel.level}`;
    }

    refresh(){
        this.containerTubes.innerHTML = "";
        this.init();
    }

    checkIfPassedTheLevel(){
        const tubes = this.containerTubes.querySelectorAll(".tube");
        let totalFilledColors = 0;

        tubes.forEach((tube) => {
            const colors = tube.querySelectorAll(".color");

            if(colors.length === this.numberOfColorsToFill){
                const lastColorFilled = colors[0].getAttribute("data-color");

                colors.forEach((color) => {
                    const colorFilled = color.getAttribute("data-color");

                    if(colorFilled === lastColorFilled){
                        totalFilledColors++;
                    }
                });
            }
        });

        if(totalFilledColors === this.tubes * this.numberOfColorsToFill){
            this.passedTheLevel = true;
            this.generateLevel();
        }
    }

    init(){
        this.generateLevel();

        this.tubesElement = document.querySelectorAll(".tube");

        this.tubesElement.forEach((tube) => {
            tube.addEventListener("click", () => this.selectColor(tube));
        });
    }
}

const game = new GetColorGame();
game.init();

const refreshButton = document.querySelector("button.refresh");
refreshButton.addEventListener("click", () => game.refresh());

// Avançar o Level
// Randomizar as quantidades de tubos a cada Level
// Adicionar confetes quando completar um tubo
// Criar PWA