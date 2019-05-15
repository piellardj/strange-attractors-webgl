class Boundaries {
    public minX: number;
    public maxX: number;
    public minY: number;
    public maxY: number;

    public constructor() {
        this.minX = 0;
        this.maxX = 0;
        this.minY = 0;
        this.maxY = 0;
    }

    public get center(): number[] {
        return [
            0.5 * (this.maxX + this.minX),
            0.5 * (this.maxY + this.minY),
        ];
    }

    public get maxDimension(): number {
        return Math.max(this.maxX - this.minX, this.maxY - this.minY);
    }

    public includePoint(x: number, y: number) {
        this.minX = Math.min(this.minX, x);
        this.minY = Math.min(this.minY, y);

        this.maxX = Math.max(this.maxX, x);
        this.maxY = Math.max(this.maxY, y);
    }
}

export default Boundaries;
