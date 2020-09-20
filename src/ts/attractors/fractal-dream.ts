import { ControlsID, Parameters } from "../parameters";
import Attractor from "./attractor";

import "../page-interface-generated";

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

    public get parameters(): string[] {
        return [
            "a = " + Parameters.a,
            "b = " + Parameters.b,
            "c = " + Parameters.c,
            "d = " + Parameters.d,
        ];
    }

    public toggleParametersVisibility(): void {
        Page.Controls.setVisibility(ControlsID.A, true);
        Page.Controls.setVisibility(ControlsID.B, true);
        Page.Controls.setVisibility(ControlsID.C, true);
        Page.Controls.setVisibility(ControlsID.D, true);
    }

    protected computeXPoints(nbPoints: number): Float32Array {
        const data = new Float32Array(2 * nbPoints);

        const a = Parameters.a;
        const b = Parameters.b;
        const c = Parameters.c;
        const d = Parameters.d;

        this.x = Math.random() * 2 - 1;
        this.y = Math.random() * 2 - 1;

        const computeNextPoint = (i: number) => {
            data[2 * i + 0] = Math.sin(b * this.y) + c * Math.sin(b * this.x);
            data[2 * i + 1] = Math.sin(a * this.x) + d * Math.sin(a * this.y);

            this.x = data[2 * i + 0];
            this.y = data[2 * i + 1];
        };

        this.fillData(nbPoints, computeNextPoint);

        return data;
    }
}

export default FractalDreamAttractor;
