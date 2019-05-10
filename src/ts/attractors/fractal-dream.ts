import { ControlsID, Parameters } from "../parameters";
import Attractor from "./attractor";

declare const Controls: any;

class FractalDreamAttractor extends Attractor {
    constructor() {
        super();
    }

    public get name(): string {
        return "Fractal Dream";
    }

    public get formula(): string {
        return `x_{n+1} = sin(b*y_{n}) + c*sin(b*x_{n})
        y_{n+1} = sin(a*x_{n}) + d*sin(a*y_{n})`;
    }

    public toggleParametersVisibility(): void {
        Controls.setVisibility(ControlsID.A, true);
        Controls.setVisibility(ControlsID.B, true);
        Controls.setVisibility(ControlsID.C, true);
        Controls.setVisibility(ControlsID.D, true);
    }

    protected computeXPoints(nbPoints: number): Float32Array {
        const data = new Float32Array(2 * nbPoints);

        const a = Parameters.a;
        const b = Parameters.b;
        const c = Parameters.c;
        const d = Parameters.d;

        let x = Math.random() * 2 - 1;
        let y = Math.random() * 2 - 1;

        /* ignore the first 1000 ones */
        for (let i = 0; i < 100; ++i) {
            data[0] = Math.sin(b * y) + c * Math.sin(b * x);
            data[1] = Math.sin(a * x) + d * Math.sin(a * y);

            x = data[0];
            y = data[1];
        }

        for (let i = 0; i < nbPoints; ++i) {
            data[2 * i + 0] = Math.sin(b * y) + c * Math.sin(b * x);
            data[2 * i + 1] = Math.sin(a * x) + d * Math.sin(a * y);

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

export default FractalDreamAttractor;
