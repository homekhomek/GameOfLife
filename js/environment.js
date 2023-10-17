class Environment {
    dims = Vec2.zero()
    creatures = [];
    FoodGrid = [];
    CollisionGrid = [];
    cellGrid = []

    constructor(width, height, startingFoodVal) {
        this.dims = new Vec2(width, height)

        this.FoodGrid = new Grid(this.dims.x, this.dims.y, 0, 0);
        this.CollisionGrid = new Grid(this.dims.x, this.dims.y, 0, 1);
        this.CellGrid = new Grid(this.dims.x, this.dims.y, null, null);
    }

    update() {
        this.creatures.forEach(c => {
            c.update();
        });

        this.creatures = this.creatures.filter(c => {
            return c.alive;
        })
    }

    draw() {
        noStroke();
        if (HyperParameters.DrawFood) {
            for (var i = 0; i < this.dims.x; i++) {
                for (var j = 0; j < this.dims.y; j++) {

                    fill(Math.min(this.FoodGrid.getValueVec(new Vec2(i, j)), 40), 0, 0);
                    rect(i * HyperParameters.PixelScalar, j * HyperParameters.PixelScalar, HyperParameters.PixelScalar, HyperParameters.PixelScalar);


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
        return Math.max(1, Math.floor((pos.x / this.dims.x) * 20))

    }
}