import { gl } from "../gl-utils/gl-canvas";
import Shader from "../gl-utils/shader";
import * as ShaderManager from "../gl-utils/shader-manager";
import VBO from "../gl-utils/vbo";
import Parameters from "../parameters";

declare const Canvas: any;

class DeJongAttractor {
    private _shader: Shader;
    private _pointsVBO: VBO;

    private _minX: number;
    private _maxX: number;

    private _minY: number;
    private _maxY: number;

    constructor() {
        const fillData = new Float32Array(2);
        this._pointsVBO = new VBO(gl, fillData, 2, gl.FLOAT, false);

        this._shader = null;
        ShaderManager.buildShader(
            {
                fragmentFilename: "points.frag",
                vertexFilename: "points.vert",
                injected: {},
            },
            (shader) => {
                if (shader !== null) {
                    this._shader = shader;
                }
            },
        );
    }

    public drawXPoints(nbPoints: number): void {
        const shader = this._shader;
        if (shader) {
            const data = this.computeXPoints(nbPoints);
            this._pointsVBO.setData(data);

            const canvasSize = Canvas.getSize();
            const aspectRatio = canvasSize[0] / canvasSize[1];

            /* tslint:disable:no-string-literal */
            shader.a["aCoords"].VBO = this._pointsVBO;
            const q = 1 - 254 / 255 * Parameters.quality;
            shader.u["uColor"].value = [q, q, q, 1];
            shader.u["uCenter"].value = [
                0.5 * (this._maxX + this._minX),
                0.5 * (this._maxY + this._minY),
            ];
            shader.u["uScale"].value = [
                2 / (0.1 + this._maxX - this._minX) / Math.max(aspectRatio, 1),
                2 / (0.1 + this._maxY - this._minY) * Math.min(aspectRatio, 1),
            ];
            /* tslint:enable:no-string-literal */

            shader.use();
            shader.bindUniformsAndAttributes();

            gl.drawArrays(gl.POINTS, 0, nbPoints);
        }
    }

    private computeXPoints(nbPoints: number): Float32Array {
        const data = new Float32Array(2 * nbPoints);

        const a = Parameters.a;
        const b = Parameters.b;
        const c = Parameters.c;
        const d = Parameters.d;

        this._minX = 0;
        this._maxX = 0;
        this._minY = 0;
        this._maxY = 0;

        let x = Math.random() * 2 - 1;
        let y = Math.random() * 2 - 1;

        /* ignore the first 1000 ones */
        for (let i = 0; i < 100; ++i) {
            data[0] = Math.sin(a * y) - Math.cos(b * x);
            data[1] = Math.sin(c * x) - Math.cos(d * y);

            x = data[0];
            y = data[1];
        }

        for (let i = 0; i < nbPoints; ++i) {
            data[2 * i + 0] = Math.sin(a * y) - Math.cos(b * x);
            data[2 * i + 1] = Math.sin(c * x) - Math.cos(d * y);

            x = data[2 * i + 0];
            y = data[2 * i + 1];

            this._minX = Math.min(this._minX, x);
            this._minY = Math.min(this._minY, y);

            this._maxX = Math.max(this._maxX, x);
            this._maxY = Math.max(this._maxY, y);
        }
        return data;
    }
}

export default DeJongAttractor;
