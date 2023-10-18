var Direction = {
    LEFT: 1,
    RIGHT: 2,
    UP: 3,
    DOWN: 4,
    RANDOM: () => { return Math.floor(Math.random() * 4) + 1 }
}


class Creature {
    cells = [];
    pos = Vec2.zero();
    env = null;
    lifetime = 0;
    foodAmt = 0;
    direction = Direction.RANDOM();
    dna = new DNA();
    radius = 0;
    alive = true;
    lifespan = 300;
    maturity = 0;
    waterAmt = 0;

    constructor(myEnv, pos, dna, startingFood = 0) {
        this.env = myEnv;
        this.pos = pos;
        this.dna = dna;

        this.foodAmt = startingFood;

        this.generateFirstCellFromDNA();

        this.calculateRadius();

        this.lifespan = this.getLifeSpan();
    }

    calculateRadius() {
        this.dna.anatomy.forEach(curCellDNA => {
            if (Math.ceil(curCellDNA.localPos.mag()) + 1 > this.radius)
                this.radius = Math.ceil(curCellDNA.localPos.mag()) + 1;
        })
    }

    getLifeSpan() {
        return this.dna.anatomy.length * 50;
    }

    getTotalCost() {
        return this.cells.reduce((tot, curCell) => { return tot + curCell.getCellCost() }, 0);
    }


    die() {
        this.getUp(); // Remove from the collision map

        this.foodAmt *= HyperParameters.FoodLossOnDeathMultiplier;

        /* corpse add food to world */
        this.cells.forEach(curCell => {
            this.env.FoodGrid.addValueVec(curCell.worldPos, curCell.getCellCost() + Math.floor(this.foodAmt / (this.cells.length)));
        })


        this.alive = false;
    }

    getUp() {
        this.cells.forEach(curCell => {
            this.env.CollisionGrid.setValueVec(curCell.worldPos, 0);
            this.env.CellGrid.setValueVec(curCell.worldPos, null);
        })
    }

    sitDown() {
        this.cells.forEach(curCell => {
            this.env.CollisionGrid.setValueVec(curCell.worldPos, 1);
            this.env.CellGrid.setValueVec(curCell.worldPos, curCell.cellType);
        })
    }

    isColliding() {
        for (var i = 0; i < this.cells.length; i++) {
            var curCell = this.cells[i];
            if (this.env.CollisionGrid.getValueVec(curCell.worldPos)) {
                return true;
            }
        }

        return false;
    }

    generateFirstCellFromDNA() {
        this.attemptBuildCell(this.dna.anatomy[0]);
    }

    attemptBuildCell(currentCellDNA) {
        var cell1 = new Cell(this, currentCellDNA.cellType, currentCellDNA.localPos.dup());

        if (currentCellDNA.localPos.y != 0) {
            var cell2 = new Cell(this, currentCellDNA.cellType, currentCellDNA.localPos.dup().mul(new Vec2(1, -1)))
            if (this.env.CollisionGrid.getValueVec(cell1.worldPos) != 1 && this.env.CollisionGrid.getValueVec(cell2.worldPos) != 1 && this.foodAmt >= cell1.getCellCost() * 2) {
                this.cells.push(cell1);
                this.cells.push(cell2);
                this.foodAmt -= cell1.getCellCost() * 2
                this.maturity += 1;
                return true;
            }

            return false
        }
        else if (this.env.CollisionGrid.getValueVec(cell1.worldPos) != 1 && this.foodAmt >= cell1.getCellCost()) {
            this.cells.push(cell1);
            this.foodAmt -= cell1.getCellCost();
            this.maturity += 1;
            return true;
        }

        return false
    }

    lifeUpdate() {
        if (!this.alive)
            return;

        /* Interact with the world */
        this.cells.forEach(curCell => {
            curCell.update(this.env);
        })

        if (this.maturity < this.dna.anatomy.length) {
            this.attemptToGrow();

        }

        this.lifetime++;

        /* Life check */
        if (this.lifetime > this.lifespan || this.foodAmt <= 0 || this.waterAmt < 0) {
            this.die();
        }
    }

    reproduceUpdate() {
        /* Reproduce? */
        if (this.env.creatures.length < HyperParameters.MaxCreatures && this.foodAmt >= this.getTotalCost() * (this.dna.foodForBabyRate + this.dna.foodKeptOnReproduce)) {
            this.attemptReproduce();
        }
    }

    attemptToGrow() {
        var nextCellDNA = this.dna.anatomy[this.maturity];

        this.attemptBuildCell(nextCellDNA);

        this.sitDown();
    }


    getRandomReproductionSpot() {
        var angle = Math.random() * 2 * Math.PI;

        var radius = Math.random() * (this.radius * 2) + this.radius * 2;

        var x = Math.floor(radius * Math.cos(angle) + .5);
        var y = Math.floor(radius * Math.sin(angle) + .5);

        return this.pos.addNew(new Vec2(x, y));
    }

    attemptReproduce() {
        this.foodAmt -= Math.floor(this.getTotalCost() * this.dna.foodForBabyRate);
        var newDNA = this.dna.copyDNA();
        newDNA.mutate();

        var reproductionPos = this.getRandomReproductionSpot();

        var creature = new Creature(this.env, reproductionPos, newDNA, Math.floor(this.getTotalCost() * this.dna.foodForBabyRate));

        if (!creature.isColliding()) {
            this.env.addCreature(creature);
        }
    }

    draw() {
        this.cells.forEach(c => c.draw());
    }
}