class Cell {
    cellType = CellTypes.DeadMaterialMouth;
    creature = null;
    localPos = Vec2.zero();
    worldPos = Vec2.zero();
    constructor(myCreature, cellType, localPos) {
        this.creature = myCreature;
        this.cellType = cellType;
        this.localPos = localPos;

        this.calculateWorldPos();
    }

    calculateWorldPos() {
        this.worldPos = this.getWorldPos();
    }

    getCellCost() {
        if (this.cellType == CellTypes.DeadMaterialMouth)
            return 15;
        else if (this.cellType == CellTypes.Body)
            return 3;
        else if (this.cellType == CellTypes.Leaf)
            return 20;
    }

    getCellFoodUpkeep() {
        if (this.cellType == CellTypes.DeadMaterialMouth)
            return 7;
        else if (this.cellType == CellTypes.Body)
            return 0;
        else if (this.cellType == CellTypes.Leaf)
            return 10;
    }

    getCellWaterUpkeep() {
        return 1;
    }

    update(env) {
        this.calculateWorldPos();

        if (this.cellType == CellTypes.DeadMaterialMouth) {
            for (var i = -1; i < 2; i++) {
                for (var j = -1; j < 2; j++) {
                    var foodAvail = env.FoodGrid.getValueVec(this.worldPos.addNew(new Vec2(i, j)));

                    this.creature.foodAmt += Math.min(HyperParameters.DecomposedMouthFoodConsumption, foodAvail);
                    env.FoodGrid.setValueVec(this.worldPos.addNew(new Vec2(i, j)), foodAvail - Math.min(HyperParameters.DecomposedMouthFoodConsumption, foodAvail));

                }
            }
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
        else if (this.cellType == CellTypes.Root) {
            for (var i = -1; i < 2; i++) {
                for (var j = -1; j < 2; j++) {
                    var waterAvail = env.WaterGrid.getValueVec(this.worldPos.addNew(new Vec2(i, j)));

                    this.creature.waterAmt += Math.min(HyperParameters.RootWaterConsumptionMax, waterAvail);
                    env.WaterGrid.setValueVec(this.worldPos.addNew(new Vec2(i, j)), waterAvail - Math.min(HyperParameters.RootWaterConsumptionMax, waterAvail));
                }
            }
        }

        if (env.WaterGrid.getValueVec(this.worldPos) > 0)
            env.WaterGrid.addValueVec(this.worldPos, -1 * this.getCellWaterUpkeep())
        else
            this.creature.waterAmt -= this.getCellWaterUpkeep();
        this.creature.foodAmt -= this.getCellFoodUpkeep();
    }

    draw() {
        if (this.cellType == CellTypes.DeadMaterialMouth) {
            fill(195, 36, 84)
        }
        else if (this.cellType == CellTypes.Body) {
            fill(205, 104, 61)
        }
        else if (this.cellType == CellTypes.Leaf) {
            fill(145, 219, 105)
        }
        rect(this.worldPos.x * HyperParameters.PixelScalar, this.worldPos.y * HyperParameters.PixelScalar, HyperParameters.PixelScalar, HyperParameters.PixelScalar);
    }

    getWorldPos() {
        return this.creature.pos.addNew(this.localPos.rotateNew(this.creature.direction));
    }
}