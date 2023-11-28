class GetColorGame {
    containerTubes = document.querySelector(".container .tubes");
    extraTubes = 0;
    selectedColor = null;
    nextSelectedColor = null;
    tubesElement = null;
    currentLevel = null;
    passedTheLevel = false;
    numberColorsToFill = 5;
    tubeSelectedClass = "selected";
    allColors = ["red", "yellow", "blue", "green", "purple", "black", "pink", "white"];
    colors = [];

    constructor(){
        this.extraTubes = 2;
        this.randomAmountOfTubes();
    }

    randomAmountOfTubes(){
        while(this.colors.length < 5){
            const quantity = Math.round(Math.random() * this.allColors.length);
            this.colors = this.allColors.slice(0, quantity);
        }
    }

    ReturnColorsByTube(index){
        const colors = [];

        for(let i = 0; i < this.numberColorsToFill; i++){
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
        for (let i = 0; i < shuffledColors.length; i += this.numberColorsToFill) {
            separateTheColorsArray.push(shuffledColors.slice(i, i + this.numberColorsToFill));
        }

        return separateTheColorsArray;
    }

    groupRandomColors() {
        const randomColorsGrouped = [];

        for (let i = 0; i < this.colors.length; i++) {
            const colors = this.ReturnColorsByTube(i);
            randomColorsGrouped.push(colors);
        }

        return randomColorsGrouped;
    }

    fillTubes(){
        this.containerTubes.innerHTML = "";

        for (let i = 0; i < this.currentLevel.allColors.length; i++) {
            const tube = document.createElement("div");
            tube.className = "tube";

            const randomColors = this.currentLevel.allColors[i];
        
            for (let j = 0; j < this.numberColorsToFill; j++) {
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
        } else if (colors.length < this.numberColorsToFill && this.selectedColor) {
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

        if(!this.currentLevel){
            this.saveLevel();
        }

        if(this.passedTheLevel){
            this.saveLevel(true);

            this.passedTheLevel = false;
            this.init();
        }

        this.fillTubes();
        this.fillExtraTubes();
        this.showLevel();
    }

    saveLevel(firstLevel = false){
        this.randomAmountOfTubes();
        const allColors = this.separateTheRandomColors(this.groupRandomColors());

        const info = {
            level: firstLevel ? this.currentLevel.level + 1 : 1,
            allColors,
            extraTubes: this.extraTubes
        };

        localStorage.setItem("getColorGame", JSON.stringify(info));
        this.currentLevel = JSON.parse(localStorage.getItem("getColorGame"));
    }

    showLevel(){
        const levelElement = document.querySelector(".container .info h1");
        levelElement.textContent = `Level ${this.currentLevel.level}`;
    }

    checkIfPassedTheLevel(){
        const tubes = this.containerTubes.querySelectorAll(".tube");
        let totalFilledColors = 0;

        tubes.forEach((tube) => {
            const colors = tube.querySelectorAll(".color");

            if(colors.length === this.numberColorsToFill){
                const lastColorFilled = colors[0].getAttribute("data-color");

                colors.forEach((color) => {
                    const colorFilled = color.getAttribute("data-color");

                    if(colorFilled === lastColorFilled){
                        totalFilledColors++;
                    }
                });
            }
        });

        if(totalFilledColors === this.currentLevel.allColors.length * this.numberColorsToFill){
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
refreshButton.addEventListener("click", () => game.init());

// Ver se é possível completar o level com esses números
// 5 - 1
// 6 - 2
// 7 - 2
// 8 - 2

// Adicionar confetes quando completar um tubo
// Ta com um bug quando um tubo so pode receber +1, mas caso ele transfere duas cores de uma vez, transfere msm assim
// Criar PWA