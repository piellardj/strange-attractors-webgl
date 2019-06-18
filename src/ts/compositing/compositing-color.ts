import FBO from "../gl-utils/fbo";
import * as GLCanvas from "../gl-utils/gl-canvas";
import { gl } from "../gl-utils/gl-canvas";
import Shader from "../gl-utils/shader";
import * as ShaderManager from "../gl-utils/shader-manager";
import VBO from "../gl-utils/vbo";
import Viewport from "../gl-utils/viewport";

import { Parameters } from "../parameters";
import CompositingBase from "./compositing";

declare const Canvas: any;

function HSVToRGB(hue: number, saturation: number, value: number): number[] {
    let r = 0;
    let g = 0;
    let b = 0;

    hue = (hue %  1) * 6;

    if (hue < 1) {
        r = 1;
        g = hue;
    } else if (hue < 2) {
        r = 2 - hue;
        g = 1;
    } else if (hue < 3) {
        g = 1;
        b = hue - 2;
    } else if (hue < 4) {
        g = 4 - hue;
        b = 1;
    } else if (hue < 5) {
        r = hue - 4;
        b = 1;
    } else if (hue < 6) {
        r = 1;
        b = 6 - hue;
    }

    r = value * (1 - saturation * (1 - r));
    b = value * (1 - saturation * (1 - b));
    g = value * (1 - saturation * (1 - g));

    return [r, g, b, 1];
}

class CompositingColor extends CompositingBase {
    private _FBO: FBO;

    private _compositionShader: Shader;

    private _texture: WebGLTexture;
    private _currentTextureSize: number;

    private _foregroundRgb: number[];
    private _backgroundRgb: number[];

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

        const canvasSize = Canvas.getSize();
        const minSize = Math.min(canvasSize[0], canvasSize[1]);
        const neededSize = upperPowerOfTwo(minSize);
        console.log("min " + minSize + " ; " + neededSize);
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

    private updateColors(): void {
        function normalizedTo255(x: number): number {
            return Math.floor(255 * x);
        }
        function rgbaToString(rgb: number[]): string {
            return "rgb(" + normalizedTo255(rgb[0]) + "," +
                normalizedTo255(rgb[1]) + "," + normalizedTo255(rgb[2])  + ")";
        }

        this._foregroundRgb = HSVToRGB(Parameters.foregroundHue, 0.8, 1);
        this.foregroundColor = rgbaToString(this._foregroundRgb);

        this._backgroundRgb = HSVToRGB(Parameters.backgroundHue, 0.2, 0.85);
        this.backgroundColor = rgbaToString(this._backgroundRgb);
    }
}

export default CompositingColor;
