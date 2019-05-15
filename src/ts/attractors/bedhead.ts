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

        this.x = Math.random() * 2 - 1;
        this.y = Math.random() * 2 - 1;

        const computeNextPoint = (i: number) => {
            data[2 * i + 0] = Math.sin(this.x * this.y / b) + Math.cos(a * this.x - this.y);
            data[2 * i + 1] = this.x + Math.sin(this.y) / b;

            this.x = data[2 * i + 0];
            this.y = data[2 * i + 1];
        };

        this.fillData(nbPoints, computeNextPoint);

        return data;
    }
}

export default BeadheadAttractor;
