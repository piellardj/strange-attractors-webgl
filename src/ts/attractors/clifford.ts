import { ControlsID, Parameters } from "../parameters";
import Attractor from "./attractor";

import "../page-interface-generated";

class CliffordAttractor extends Attractor {
    constructor() {
        super();
    }

    public get name(): string {
        return "Clifford";
    }

    public get formula(): string {
        return `x_{n+1} = sin(a*y_{n}) + c*cos(a*x_{n})
        y_{n+1} = sin(c*x_{n}) + d*cos(b*y_{n})`;
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
            data[2 * i + 0] = Math.sin(a * this.y) + c * Math.cos(a * this.x);
            data[2 * i + 1] = Math.sin(c * this.x) + d * Math.cos(b * this.y);

            this.x = data[2 * i + 0];
            this.y = data[2 * i + 1];
        };

        this.fillData(nbPoints, computeNextPoint);

        return data;
    }
}

export default CliffordAttractor;
