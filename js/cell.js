class Cell {
    cellType = CellTypes.Mouth;
    creature = null;
    localPos = Vec2.zero();
    worldPos = Vec2.zero();
    constructor(myCreature, cellType, localPos) {
        this.creature = myCreature;
        this.cellType = cellType;
        this.localPos = localPos;
        this.worldPos = this.getWorldPos();
    }

    getCellCost() {
        if (this.cellType == CellTypes.Mouth)
            return 5;
        else if (this.cellType == CellTypes.Body)
            return 3;
        else if (this.cellType == CellTypes.Leaf)
            return 20;
    }

    getCellUpkeep() {
        if (this.cellType == CellTypes.Mouth)
            return 2;
        else if (this.cellType == CellTypes.Body)
            return 1;
        else if (this.cellType == CellTypes.Leaf)
            return 10;
    }


    update(env) {
        this.worldPos = this.getWorldPos();

        if (this.cellType == CellTypes.Mouth) {
            var foodAtSpot = env.FoodGrid.getValueVec(this.worldPos);

            this.creature.foodAmt += Math.min(HyperParameters.MouthConsumptionPerTurn, foodAtSpot);
            foodAtSpot -= HyperParameters.MouthConsumptionPerTurn;

            env.FoodGrid.setValueVec(this.worldPos, foodAtSpot);
        }
        else if (this.cellType == CellTypes.Leaf) {
            var sun = env.getSunAtPos(this.worldPos);

            for (var i = -1; i < 2; i++) {
                for (var j = -1; j < 2; j++) {
                    if ((j != 0 || i != 0) && env.CellGrid.getValueVec(this.worldPos.addNew(new Vec2(i, j))) == CellTypes.Leaf) {
                        sun = 0;
                        break;
                    }
                }
            }
            this.creature.foodAmt += sun;
        }

        this.creature.foodAmt -= this.getCellUpkeep();
    }

    draw() {
        var pos = this.getWorldPos();

        if (this.cellType == CellTypes.Mouth) {
            fill(255, 0, 0)
        }
        else if (this.cellType == CellTypes.Body) {
            fill(173, 140, 38)
        }
        else if (this.cellType == CellTypes.Leaf) {
            fill(0, 200, 90)
        }
        rect(pos.x * HyperParameters.PixelScalar, pos.y * HyperParameters.PixelScalar, HyperParameters.PixelScalar, HyperParameters.PixelScalar);
    }

    getWorldPos() {
        return this.creature.pos.addNew(this.localPos.rotateNew(this.creature.direction));
    }
}