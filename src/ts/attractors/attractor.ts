import { gl } from "../gl-utils/gl-canvas";
import Shader from "../gl-utils/shader";
import * as ShaderManager from "../gl-utils/shader-manager";
import VBO from "../gl-utils/vbo";
import { Parameters } from "../parameters";

import * as Infos from "../infos";

let shader: Shader = null;
let pointsVBO: VBO = null;

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

declare const Canvas: any;

abstract class Attractor {
    protected boundaries: Boundaries;
    protected x: number;
    protected y: number;

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

        this.boundaries = null;
    }

    public drawXPoints(nbPoints: number): void {
        if (shader) {
            this.boundaries = null;
            const data = this.computeXPoints(nbPoints);
            pointsVBO.setData(data);

            const canvasSize = Canvas.getSize();
            const aspectRatio = canvasSize[0] / canvasSize[1];

            /* tslint:disable:no-string-literal */
            shader.a["aCoords"].VBO = pointsVBO;
            const q = 1 - 254 / 255 * Parameters.quality;
            shader.u["uColor"].value = [q, q, q, 1];
            shader.u["uCenter"].value = this.boundaries.center;
            const maxDimension = 0.5 + this.boundaries.maxDimension;
            shader.u["uScale"].value = [
                2 / maxDimension / Math.max(aspectRatio, 1),
                2 / maxDimension * Math.min(aspectRatio, 1),
            ];
            /* tslint:enable:no-string-literal */

            shader.use();
            shader.bindUniformsAndAttributes();

            gl.drawArrays(gl.POINTS, 0, nbPoints);
        }
    }

    public reset(): void {
        this.toggleParametersVisibility();
        Infos.setTitle(this.name);
        Infos.setFormula(this.formula);
        Infos.setParameters(this.parameters);
    }

    /* For infos block display */
    public abstract get name(): string;
    public abstract get formula(): string;
    public abstract get parameters(): string[];

    public abstract toggleParametersVisibility(): void;

    /* Should update minX, maxX, minY and maxY */
    protected abstract computeXPoints(nbPoints: number): Float32Array;

    protected fillData(nbPoints: number,computeNextPoint: (pointIndex: number) => void) {
        /* ignore the first 1000 ones */
        for (let i = 0; i < 100; ++i) {
            computeNextPoint(0);
        }

        if (this.boundaries === null) {
            this.boundaries = new Boundaries();

            for (let i = 0; i < nbPoints; ++i) {
                computeNextPoint(i);
                this.boundaries.includePoint(this.x, this.y);
            }
        } else {
            for (let i = 0; i < nbPoints; ++i) {
                computeNextPoint(i);
            }
        }
    }
}

export {
    Attractor,
    Boundaries,
};
