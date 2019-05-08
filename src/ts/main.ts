import * as GLCanvas from "./gl-utils/gl-canvas";
import { gl } from "./gl-utils/gl-canvas";
import Viewport from "./gl-utils/viewport";

import DeJongAttractor from "./attractors/de-jong";
import Parameters from "./parameters";

declare const Canvas: any;

function main() {
    initGL();

    let needToAdjustCanvas = true;
    Canvas.Observers.canvasResize.push(() => needToAdjustCanvas = true);
    Parameters.clearObservers.push(() => needToAdjustCanvas = true);

    const attractor = new DeJongAttractor();

    let totalPoints: number;
    function setTotalPoints(total: number): void {
        totalPoints = total;
        Canvas.setIndicatorText("points-drawn", totalPoints.toLocaleString());
    }
    setTotalPoints(0);

    let drawnOnce = false;
    function mainLoop() {
        if (needToAdjustCanvas) {
            needToAdjustCanvas = false;
            setTotalPoints(0);
            drawnOnce = false;

            GLCanvas.adjustSize();
            Viewport.setFullCanvas(gl);
            gl.clear(gl.COLOR_BUFFER_BIT);
        }

        if (Parameters.autorun && !drawnOnce) {
            // drawnOnce = true;
            const STEP_SIZE = Math.pow(2, 16);
            setTotalPoints(totalPoints + STEP_SIZE);
            attractor.drawXPoints(STEP_SIZE);
        }
    
        requestAnimationFrame(mainLoop);
    }

    requestAnimationFrame(mainLoop);

    function initGL() {
        const glParams = {
            alpha: false,
            // antialias: false,
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
}

main();
