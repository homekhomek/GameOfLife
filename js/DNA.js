class DNA {
    anatomy = [];
    mutationRate = 0.1;
    foodForBabyRate = 1.5;
    foodKeptOnReproduce = 1.0;

    constructor() {

    }

    mutate() {

        // Mutate DNA
        if (Math.random() < this.mutationRate) {
            if (Math.random() < 0.33) { // Add a cell
                this.anatomy.push(new CellDNA(this.getRandomCellType(), this.getNewCellLocation()));
            }
            else if (Math.random() < .5 && this.anatomy.length > 1) {
                this.anatomy.splice(Math.floor(Math.random() * this.anatomy.length), 1)
            }
            else {
                this.anatomy[Math.floor(Math.random() * this.anatomy.length)].cellType = this.getRandomCellType();
            }
        }

        // Flucuate Mutation Rate
        if (Math.random() < .66) {
            if (Math.random() > .5)
                this.mutationRate += .01;
            else
                this.mutationRate -= .01;
        }

        // Flucuate Food Reproduction Rate
        if (Math.random() < .66) {
            if (Math.random() > .5)
                this.foodForBabyRate += .05;
            else
                this.foodForBabyRate -= .05;
        }

        // Flucuate Food Reproduction Rate
        if (Math.random() < .66) {
            if (Math.random() > .5)
                this.foodKeptOnReproduce += .05;
            else
                this.foodKeptOnReproduce -= .05;
        }
    }

    getRandomCellType() {
        return Math.floor(Math.random() * Object.keys(CellTypes).length);
    }

    getNewCellLocation() {
        var posLocations = []

        for (var i = 0; i < this.anatomy.length; i++) {
            var curLoc = this.anatomy[i].localPos;
            if (curLoc.y > 0) {
                posLocations.push(curLoc.addNew(new Vec2(0, -1)))
            }
            posLocations.push(curLoc.addNew(new Vec2(1, 0)))
            posLocations.push(curLoc.addNew(new Vec2(-1, 0)))
            posLocations.push(curLoc.addNew(new Vec2(0, 1)))
        }

        for (var i = 0; i < this.anatomy.length; i++) {
            var curLoc = this.anatomy[i].localPos;
            posLocations = posLocations.filter(checkLoc => checkLoc.x != curLoc.x || checkLoc.y != curLoc.y);
        }

        return posLocations[Math.floor(Math.random() * posLocations.length)]
    }

    copyDNA() {
        var newDNA = new DNA();
        newDNA.mutationRate = this.mutationRate;
        newDNA.reproduceFoodRate = this.reproduceFoodRate;

        for (var i = 0; i < this.anatomy.length; i++) {
            newDNA.anatomy.push(new CellDNA(this.anatomy[i].cellType, this.anatomy[i].localPos.dup()));
        }

        return newDNA;
    }
}