import { gl } from "../gl-utils/gl-canvas";
import Shader from "../gl-utils/shader";
import * as ShaderManager from "../gl-utils/shader-manager";
import VBO from "../gl-utils/vbo";
import { Parameters } from "../parameters";

let shader: Shader = null;
let pointsVBO: VBO = null;

declare const Canvas: any;

abstract class Attractor {
    protected minX: number;
    protected maxX: number;
    protected minY: number;
    protected maxY: number;

    constructor() {
        if (shader === null) {
            ShaderManager.buildShader(
                {
                    fragmentFilename: "points.frag",
                    vertexFilename: "points.vert",
                    injected: {},
                },
                (newShader) => {
                    if (newShader !== null) {
                        shader = newShader;
                    }
                },
            );
        }

        if (pointsVBO === null) {
            const fillData = new Float32Array(2);
            pointsVBO = new VBO(gl, fillData, 2, gl.FLOAT, false);
        }
    }

    public drawXPoints(nbPoints: number): void {
        if (shader) {
            this.resetBoundaries();
            const data = this.computeXPoints(nbPoints);
            pointsVBO.setData(data);

            const canvasSize = Canvas.getSize();
            const aspectRatio = canvasSize[0] / canvasSize[1];

            /* tslint:disable:no-string-literal */
            shader.a["aCoords"].VBO = pointsVBO;
            const q = 1 - 254 / 255 * Parameters.quality;
            shader.u["uColor"].value = [q, q, q, 1];
            shader.u["uCenter"].value = [
                0.5 * (this.maxX + this.minX),
                0.5 * (this.maxY + this.minY),
            ];
            shader.u["uScale"].value = [
                2 / (0.1 + this.maxX - this.minX) / Math.max(aspectRatio, 1),
                2 / (0.1 + this.maxY - this.minY) * Math.min(aspectRatio, 1),
            ];
            /* tslint:enable:no-string-literal */

            shader.use();
            shader.bindUniformsAndAttributes();

            gl.drawArrays(gl.POINTS, 0, nbPoints);
        }
    }

    public abstract toggleParametersVisibility(): void;

    /* Should update minX, maxX, minY and maxY */
    protected abstract computeXPoints(nbPoints: number): Float32Array;

    private resetBoundaries(): void {
        this.minX = 0;
        this.maxX = 0;
        this.minY = 0;
        this.maxY = 0;
    }
}

export default Attractor;
