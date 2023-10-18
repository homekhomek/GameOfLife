class Environment {
    dims = Vec2.zero()
    creatures = [];
    FoodGrid = [];
    CollisionGrid = [];
    CellGrid = []

    constructor(width, height, startingFoodVal) {
        this.dims = new Vec2(width, height)

        this.FoodGrid = new Grid(this.dims.x, this.dims.y, 0, 0);
        this.WaterGrid = new Grid(this.dims.x, this.dims.y, 20, 0);
        this.CollisionGrid = new Grid(this.dims.x, this.dims.y, 0, 1);
        this.CellGrid = new Grid(this.dims.x, this.dims.y, null, null);
    }

    update() {
        this.creatures.forEach(c => {
            c.lifeUpdate();
        });

        this.creatures = this.creatures.filter(c => {
            return c.alive;
        })

        this.creatures.toSorted((a, b) => b.foodAmt - a.foodAmt).forEach(c => {
            c.reproduceUpdate();
        })

        this.WaterGrid.diffuse(30);
    }

    draw() {
        noStroke();
        if (HyperParameters.DrawFood) {
            for (var i = 0; i < this.dims.x; i++) {
                for (var j = 0; j < this.dims.y; j++) {
                    if (this.WaterGrid.getValueVec(new Vec2(i, j)) > 0) {
                        var waterVal = (this.WaterGrid.getValueVec(new Vec2(i, j)) / 30)
                        fill(46 + Math.floor(waterVal * 31), 34 + Math.floor(waterVal * 121), 47 + Math.floor(waterVal * 183));

                        rect(i * HyperParameters.PixelScalar, j * HyperParameters.PixelScalar, HyperParameters.PixelScalar, HyperParameters.PixelScalar);
                    }



                }
            }
        }

        this.creatures.forEach(c => {
            c.draw();
        });
    }

    addCreature(cr) {
        this.creatures.push(cr);

        cr.sitDown();
    }

    getSunAtPos(pos) {
        return Math.max(1, Math.floor((1 - (pos.x / this.dims.x)) * 20))

    }
}