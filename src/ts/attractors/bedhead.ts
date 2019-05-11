import { ControlsID, Parameters } from "../parameters";
import Attractor from "./attractor";

declare const Controls: any;

class BeadheadAttractor extends Attractor {
    constructor() {
        super();
    }

    public get name(): string {
        return "Bedhead";
    }

    public get formula(): string {
        return `x_{n+1} = sin(x_{n}*y_{n}/b) + cos(a*x_{n} - y_{n})
        y_{n+1} = x_{n} + sin(y_{n})/b`;
    }

    public get parameters(): string[] {
        return [
            "a = " + Parameters.a,
            "b = " + Parameters.b,
        ];
    }

    public toggleParametersVisibility(): void {
        Controls.setVisibility(ControlsID.A, true);
        Controls.setVisibility(ControlsID.B, true);
        Controls.setVisibility(ControlsID.C, false);
        Controls.setVisibility(ControlsID.D, false);
    }

    protected computeXPoints(nbPoints: number): Float32Array {
        const data = new Float32Array(2 * nbPoints);

        const a = Parameters.a;
        const b = Parameters.b;

        let x = Math.random() * 2 - 1;
        let y = Math.random() * 2 - 1;

        /* ignore the first 1000 ones */
        for (let i = 0; i < 100; ++i) {
            data[0] = Math.sin(x * y / b) + Math.cos(a * x - y);
            data[1] = x + Math.sin(y) / b;

            x = data[0];
            y = data[1];
        }

        for (let i = 0; i < nbPoints; ++i) {
            data[2 * i + 0] = Math.sin(x * y / b) + Math.cos(a * x - y);
            data[2 * i + 1] = x + Math.sin(y) / b;

            x = data[2 * i + 0];
            y = data[2 * i + 1];

            this.minX = Math.min(this.minX, x);
            this.minY = Math.min(this.minY, y);

            this.maxX = Math.max(this.maxX, x);
            this.maxY = Math.max(this.maxY, y);
        }
        return data;
    }
}

export default BeadheadAttractor;
