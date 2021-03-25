import FBO from "../gl-utils/fbo";
import * as GLCanvas from "../gl-utils/gl-canvas";
import { gl } from "../gl-utils/gl-canvas";
import Shader from "../gl-utils/shader";
import * as ShaderManager from "../gl-utils/shader-manager";
import VBO from "../gl-utils/vbo";
import Viewport from "../gl-utils/viewport";

import { Parameters } from "../parameters";
import CompositingBase from "./compositing";

import "../page-interface-generated";

class CompositingColor extends CompositingBase {
    private _FBO: FBO;

    private _compositionShader: Shader;

    private _texture: WebGLTexture;
    private _currentTextureSize: number;

    private _foregroundRgb: number[]; // in [0, 1]^3
    private _backgroundRgb: number[]; // in [0, 1]^3

    public constructor() {
        super();
        this.backgroundColor = "red";
        this.foregroundColor = "yellow";

        ShaderManager.buildShader(
            {
                fragmentFilename: "compose.frag",
                vertexFilename: "compose.vert",
                injected: {},
            },
            (newShader) => {
                if (newShader !== null) {
                    this._compositionShader = newShader;
                    /* tslint:disable:no-string-literal */
                    this._compositionShader.a["aCorner"].VBO = VBO.createQuad(gl, -1, -1, 1, 1);
                    /* tslint:enable:no-string-literal */
                }
            },
        );

        const size = 512;

        this._FBO = new FBO(gl, size, size);
        this._currentTextureSize = 0;
        this.initializeTexture(size);
    }

    public initialize(): void {
        function upperPowerOfTwo(x: number): number {
            return Math.pow(2, Math.ceil(Math.log(x) * Math.LOG2E));
        }

        const canvasSize = Page.Canvas.getSize();
        const minSize = Math.min(canvasSize[0], canvasSize[1]);
        const neededSize = upperPowerOfTwo(minSize);
        if (this._currentTextureSize !== neededSize) {
            this.initializeTexture(neededSize);
            this._FBO.width = neededSize;
            this._FBO.height = neededSize;
        }

        gl.clearColor(0, 0, 0, 1);

        gl.enable(gl.BLEND);
        gl.blendFunc(gl.ONE, gl.ONE);
        gl.blendEquation(gl.FUNC_ADD);

        GLCanvas.adjustSize();

        this._FBO.bind([this._texture]);
        gl.clear(gl.COLOR_BUFFER_BIT);

        FBO.bindDefault(gl);
        gl.clear(gl.COLOR_BUFFER_BIT);

        this.updateColors();
    }

    public bindTopLayer(): void {
        this._FBO.bind([this._texture]);
    }

    public compose(): void {
        if (this._compositionShader) {
            FBO.bindDefault(gl);
            Viewport.setFullCanvas(gl);
            gl.clear(gl.COLOR_BUFFER_BIT);

            /* tslint:disable:no-string-literal */
            this._compositionShader.u["uTexture"].value = this._texture;
            this._compositionShader.u["uForegroundColor"].value = this._foregroundRgb;
            this._compositionShader.u["uBackgroundColor"].value = this._backgroundRgb;
            /* tslint:enable:no-string-literal */

            this._compositionShader.use();
            this._compositionShader.bindUniformsAndAttributes();
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        }
    }

    public updateColors(): void {
        function normalizedTo255(x: number): number {
            return Math.floor(255 * x);
        }
        function rgbaToString(rgb: number[]): string {
            return "rgb(" + normalizedTo255(rgb[0]) + "," +
                normalizedTo255(rgb[1]) + "," + normalizedTo255(rgb[2])  + ")";
        }

        this._foregroundRgb = Parameters.foregroundColor;
        this.foregroundColor = rgbaToString(this._foregroundRgb);

        this._backgroundRgb = Parameters.backgroundColor;
        this.backgroundColor = rgbaToString(this._backgroundRgb);
    }

    /* size parameter should be a power of two */
    private initializeTexture(size: number): void {
        if (this._texture) {
            gl.deleteTexture(this._texture);
            this._texture = null;
        }

        const uintTexels: number[] = new Array(4 * size * size);
        for (let i = 0; i < uintTexels.length;  ++i) {
            uintTexels[i] = 127;
        }
        const uintData = new Uint8Array(uintTexels);
        this._texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this._texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, size, size, 0, gl.RGBA, gl.UNSIGNED_BYTE, uintData);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        gl.bindTexture(gl.TEXTURE_2D, null);

        this._currentTextureSize = size;
    }
}

export default CompositingColor;
