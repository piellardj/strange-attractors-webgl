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
declare const Tabs: any;

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
            attractor.reset();
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
        const figureSize = +Tabs.getValues(ControlsID.DOWNLOAD_SIZE)[0];

        const luminosity = totalPoints / (gl.canvas.width * gl.canvas.height);
        const nbPointsNeeded = luminosity * figureSize * figureSize;

        const canvas2D = document.createElement("canvas");
        const ctx2D = canvas2D.getContext("2d");

        canvas2D.width = figureSize + 400;
        canvas2D.height = figureSize;

        const canvasGL = Canvas.getCanvas();
        function isolateCanvasGL() {
            Canvas.showLoader(true);

            canvasGL.style.position = "absolute";
            canvasGL.style.width = figureSize + "px";
            canvasGL.style.height = figureSize + "px";
            canvasGL.width = figureSize;
            canvasGL.height = figureSize;

            GLCanvas.adjustSize();
            Viewport.setFullCanvas(gl);
            gl.clear(gl.COLOR_BUFFER_BIT);
        }

        function restoreCanvasGL() {
            canvasGL.style.position = "";
            canvasGL.style.width = "";
            canvasGL.style.height = "";
            Canvas.showLoader(false);
            Canvas.setLoaderText("");
            needToAdjustCanvas = true;
        }

        isolateCanvasGL();

        let nbPoints = 0;
        const stepSize = Math.pow(2, 18);
        while (nbPoints < nbPointsNeeded) {
            nbPoints += stepSize;
            attractor.drawXPoints(stepSize);
        }

        ctx2D.fillStyle = "black";
        ctx2D.fillRect(0, 0, canvas2D.width, canvas2D.height);
        ctx2D.drawImage(gl.canvas, 0.5 * (canvas2D.width - figureSize), 0, figureSize, figureSize);
        restoreCanvasGL();
        Infos.drawToCanvas(ctx2D);

        if ((canvas2D as any).msToBlob) { // for IE
            const blob = (canvas2D as any).msToBlob();
            window.navigator.msSaveBlob(blob, "image.png");
        } else {
            canvas2D.toBlob((blob) => {
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
