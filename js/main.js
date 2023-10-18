var updateToggle = true;
var drawToggle = true;

var HyperParameters = {
    EnvWidth: 200,
    EnvHeight: 200,

    PixelScalar: 4,
    DrawFood: true,

    CellCountLifeSpanMultiplier: 3,
    DecomposedMouthFoodConsumption: 3,
    CellReproductionMultiplier: 3,
    FoodLossOnDeathMultiplier: .2,
    MaxCreatures: 600,

}

var CellTypes = {
    DeadMaterialMouth: 0,
    Body: 1,
    Leaf: 2
}



function setup() {
    createCanvas(HyperParameters.EnvWidth * HyperParameters.PixelScalar, HyperParameters.EnvHeight * HyperParameters.PixelScalar);
    curEnv = new Environment(HyperParameters.EnvWidth, HyperParameters.EnvHeight, 0);

    var dna = new DNA();
    dna.anatomy.push(new CellDNA(CellTypes.Leaf, new Vec2(0, 0)));
    dna.anatomy.push(new CellDNA(CellTypes.Body, new Vec2(0, 1)));
    var spawnPos = new Vec2(Math.floor(40), 40);

    var c = new Creature(curEnv, spawnPos, dna, 150);

    curEnv.addCreature(c);

}


function draw() {
    background(46, 34, 47);


    if (updateToggle)
        curEnv.update();

    if (drawToggle)
        curEnv.draw();
}