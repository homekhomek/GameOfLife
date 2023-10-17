class Grid {
    width = 0;
    height = 0;
    starterValue = 0;
    outOfBoundsValue = null;

    values = [];

    constructor(width, height, starterValue, outOfBoundsValue = null) {
        this.width = width;
        this.height = height;
        this.outOfBoundsValue = outOfBoundsValue;
        for (var i = 0; i < this.width; i++) {
            var row = [];
            for (var j = 0; j < this.height; j++) {
                row.push(starterValue);
            }
            this.values.push(row);
        }
    }

    getValue(x, y) {
        if (x < 0 || x >= this.values.length || y < 0 || y >= this.values[0].length)
            return this.outOfBoundsValue;
        return this.values[x][y];
    }

    getValueVec(vec) {
        return this.getValue(vec.x, vec.y);
    }

    setValue(x, y, val) {
        if (x < 0 || x >= this.values.length || y < 0 || y >= this.values[0].length)
            return;
        this.values[x][y] = val;
    }

    setValueVec(vec, val) {
        if (vec.x < 0 || vec.x >= this.values.length || vec.y < 0 || vec.y >= this.values[0].length)
            return;
        this.values[vec.x][vec.y] = val;
    }

    addValue(x, y, val) {
        if (x < 0 || x >= this.values.length || y < 0 || y >= this.values[0].length)
            return;
        this.values[x][y] += val;
    }

    addValueVec(vec, val) {
        if (vec.x < 0 || vec.x >= this.values.length || vec.y < 0 || vec.y >= this.values[0].length)
            return;
        this.values[vec.x][vec.y] += val;
    }
}