import * as GLCanvas from "./gl-utils/gl-canvas";
import { gl } from "./gl-utils/gl-canvas";
import Viewport from "./gl-utils/viewport";

import Attractor from "./attractors/attractor";
import BedHeadAttractor from "./attractors/bedhead";
import CliffordAttractor from "./attractors/clifford";
import DeJongAttractor from "./attractors/de-jong";
import FractalDreamAttractor from "./attractors/fractal-dream";
import * as Infos from "./infos";
import { attractorNames, ControlsID, Parameters } from "./parameters";

declare const Canvas: any;
declare const FileControl: any;

function main() {
    initGL();

    let needToAdjustCanvas = true;
    Canvas.Observers.canvasResize.push(() => needToAdjustCanvas = true);
    Parameters.clearObservers.push(() => needToAdjustCanvas = true);

    Parameters.attractor = attractorNames.DeJong;

    const attractors = {};
    attractors[attractorNames.Bedhead] = new BedHeadAttractor();
    attractors[attractorNames.Clifford] = new CliffordAttractor();
    attractors[attractorNames.DeJong] = new DeJongAttractor();
    attractors[attractorNames.FractalDream] = new FractalDreamAttractor();

    let totalPoints: number;
    function setTotalPoints(total: number): void {
        totalPoints = total;
        Canvas.setIndicatorText("points-drawn", totalPoints.toLocaleString());
    }
    setTotalPoints(0);

    let attractor: Attractor;
    function mainLoop() {
        if (needToAdjustCanvas) {
            needToAdjustCanvas = false;
            setTotalPoints(0);

            GLCanvas.adjustSize();
            Viewport.setFullCanvas(gl);
            gl.clear(gl.COLOR_BUFFER_BIT);

            attractor = attractors[Parameters.attractor];
            attractor.toggleParametersVisibility();
            Infos.setTitle(attractor.name);
            Infos.setFormula(attractor.formula);
        }

        if (Parameters.autorun) {
            const STEP_SIZE = Math.pow(2, 16);
            setTotalPoints(totalPoints + STEP_SIZE);
            attractor.drawXPoints(STEP_SIZE);
        }

        requestAnimationFrame(mainLoop);
    }

    function initGL() {
        const glParams = {
            alpha: false,
            depth: false,
            preserveDrawingBuffer: true,
        };
        if (!GLCanvas.initGL(glParams)) {
            return;
        }

        gl.enable(gl.BLEND);
        gl.clearColor(0, 0, 0, 1);
        gl.blendEquation(gl.FUNC_ADD);
        gl.blendFunc(gl.ONE, gl.ONE);
    }

    FileControl.addDownloadObserver(ControlsID.DOWNLOAD, () => {
        const width = 1024;
        const height = 1024;

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = width;
        canvas.height = height;

        Infos.drawToCanvas(ctx);

        if ((canvas as any).msToBlob) { // for IE
            const blob = (canvas as any).msToBlob();
            window.navigator.msSaveBlob(blob, "image.png");
        } else {
            canvas.toBlob((blob) => {
                const link = document.createElement("a");
                link.download = "image.png";
                link.href = URL.createObjectURL(blob);
                link.click();
            });
        }
    });

    requestAnimationFrame(mainLoop);
}

main();
