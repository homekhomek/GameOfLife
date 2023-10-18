class Grid {
    width = 0;
    height = 0;
    starterValue = 0;
    outOfBoundsValue = null;

    values = [];
    allTiles = [];

    constructor(width, height, starterValue, outOfBoundsValue = null) {
        this.width = width;
        this.height = height;
        this.outOfBoundsValue = outOfBoundsValue;
        for (var i = 0; i < this.width; i++) {
            var row = [];
            for (var j = 0; j < this.height; j++) {
                var newT = new Tile(i, j, starterValue);
                row.push(newT);
                this.allTiles.push(newT);
            }
            this.values.push(row);
        }
    }

    diffuse(maxTransfer) {
        var sortedTiles = this.allTiles.toSorted((a, b) => a.value - b.value);

        for (var i = 0; i < sortedTiles.length; i++) {
            if (Math.random() < .5) {
                if (Math.random() < .5)
                    this.diffuseDirection(sortedTiles[i], maxTransfer, 0, 1);
                else
                    this.diffuseDirection(sortedTiles[i], maxTransfer, -1, 0);
            }
            else {
                if (Math.random() < .5)
                    this.diffuseDirection(sortedTiles[i], maxTransfer, 1, 0);
                else
                    this.diffuseDirection(sortedTiles[i], maxTransfer, 0, -1);

            }
        }
    }

    diffuseDirection(curTile, maxAmount, xDelta, yDelta) {
        if (this.getValue(curTile.x + xDelta, curTile.y + yDelta) > curTile.value) {
            var drain = Math.min(Math.ceil((this.getValue(curTile.x + xDelta, curTile.y + yDelta) - curTile.value) / 2), maxAmount);

            curTile.value += drain;
            this.addValue(curTile.x + xDelta, curTile.y + yDelta, -1 * drain);
        }
    }

    getValue(x, y) {
        if (x < 0 || x >= this.values.length || y < 0 || y >= this.values[0].length)
            return this.outOfBoundsValue;
        return this.values[x][y].value;
    }

    getValueVec(vec) {
        return this.getValue(vec.x, vec.y);
    }

    setValue(x, y, val) {
        if (x < 0 || x >= this.values.length || y < 0 || y >= this.values[0].length)
            return;
        this.values[x][y].value = val;
    }

    setValueVec(vec, val) {
        if (vec.x < 0 || vec.x >= this.values.length || vec.y < 0 || vec.y >= this.values[0].length)
            return;
        this.values[vec.x][vec.y].value = val;
    }

    addValue(x, y, val) {
        if (x < 0 || x >= this.values.length || y < 0 || y >= this.values[0].length)
            return;
        this.values[x][y].value += val;
    }

    addValueVec(vec, val) {
        if (vec.x < 0 || vec.x >= this.values.length || vec.y < 0 || vec.y >= this.values[0].length)
            return;
        this.values[vec.x][vec.y].value += val;
    }
}