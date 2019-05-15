import { ControlsID, Parameters } from "../parameters";
import Attractor from "./attractor";

declare const Controls: any;

class DeJongAttractor extends Attractor {
    constructor() {
        super();
    }

    public get name(): string {
        return "De Jong";
    }

    public get formula(): string {
        return `x_{n+1} = sin(a*y_{n}) - cos(b*x_{n})
        y_{n+1} = sin(c*x_{n}) - cos(d*y_{n})`;
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

        this.x = Math.random() * 2 - 1;
        this.y = Math.random() * 2 - 1;

        const computeNextPoint = (i: number) => {
            data[2 * i + 0] = Math.sin(a * this.y) - Math.cos(b * this.x);
            data[2 * i + 1] = Math.sin(c * this.x) - Math.cos(d * this.y);

            this.x = data[2 * i + 0];
            this.y = data[2 * i + 1];
        };

        this.fillData(nbPoints, computeNextPoint);

        return data;
    }
}

export default DeJongAttractor;
