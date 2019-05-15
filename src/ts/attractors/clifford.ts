import { ControlsID, Parameters } from "../parameters";
import { Attractor, Boundaries } from "./attractor";

declare const Controls: any;

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

        function computeNextPoint(i: number) {
            data[2 * i + 0] = Math.sin(a * y) + c * Math.cos(a * x);
            data[2 * i + 1] = Math.sin(c * x) + d * Math.cos(b * y);

            x = data[2 * i + 0];
            y = data[2 * i + 1];
        }

        /* ignore the first 1000 ones */
        for (let i = 0; i < 100; ++i) {
            computeNextPoint(0);
        }

        if (this.boundaries === null) {
            this.boundaries = new Boundaries();
            this.boundaries.includePoint(x, y);

            for (let i = 0; i < nbPoints; ++i) {
                computeNextPoint(i);
                this.boundaries.includePoint(x, y);
            }
        } else {
            for (let i = 0; i < nbPoints; ++i) {
                computeNextPoint(i);
            }
        }

        return data;
    }
}

export default CliffordAttractor;
