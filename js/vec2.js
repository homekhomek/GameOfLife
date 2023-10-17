class Vec2 {
    x = 0;
    y = 0;

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    addNew(addVec) {
        return new Vec2(this.x + addVec.x, this.y + addVec.y);
    }

    dup() {
        return new Vec2(this.x, this.y);
    }

    mag() {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }

    mul(mulVec) {
        this.x *= mulVec.x;
        this.y *= mulVec.y;
        return this;
    }

    trans() {
        var temp = this.x;
        this.x = this.y;
        this.y = temp;

        return this;
    }

    rotateNew(dir) {
        if (dir == Direction.RIGHT) {
            return this.dup();
        }
        else if (dir == Direction.LEFT) {
            return this.dup().mul(new Vec2(-1, 1));
        }
        else if (dir == Direction.UP) {
            return this.dup().trans().mul(new Vec2(-1, 1));
        }
        else if (dir == Direction.DOWN) {
            return this.dup().trans().mul(new Vec2(-1, 1));
        }
    }

    static zero() {
        return new Vec2(0, 0);
    }
}