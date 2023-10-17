var curEnv = null;
var paused = false;
var doTheDraw = true;
var HyperParameters = {
    CanvasWidth: 800,
    CanvasHeight: 200,

    PixelScalar: 4,
    DrawFood: true,

    CellCountLifeSpanMultiplier: 3,
    MouthConsumptionPerTurn: 20,
    CellReproductionMultiplier: 3,
}

var CellTypes = {
    Mouth: 0,
    Body: 1,
    Leaf: 2
}



function setup() {
    createCanvas(HyperParameters.CanvasWidth, HyperParameters.CanvasHeight);
    curEnv = new Environment(HyperParameters.CanvasWidth / HyperParameters.PixelScalar, HyperParameters.CanvasHeight / HyperParameters.PixelScalar, 0);

    var dna = new DNA();
    dna.anatomy.push(new CellDNA(CellTypes.Leaf, new Vec2(0, 0)));
    dna.anatomy.push(new CellDNA(CellTypes.Body, new Vec2(0, 1)));
    var spawnPos = new Vec2(Math.floor(180), Math.floor(curEnv.dims.y / 2));

    var c = new Creature(curEnv, spawnPos, dna, 150);

    curEnv.addCreature(c);
}


function draw() {
    background(0);

    curEnv.update();
    if (doTheDraw)
        curEnv.draw();
}