import * as GLCanvas from "./gl-utils/gl-canvas";
import { gl } from "./gl-utils/gl-canvas";

import Attractor from "./attractors/attractor";
import BedHeadAttractor from "./attractors/bedhead";
import CliffordAttractor from "./attractors/clifford";
import DeJongAttractor from "./attractors/de-jong";
import FractalDreamAttractor from "./attractors/fractal-dream";
import * as Infos from "./infos";
import { attractorNames, compositingNames, ControlsID, Parameters } from "./parameters";

import Compositing from "./compositing/compositing";
import CompositingColor from "./compositing/compositing-color";
import CompositingDark from "./compositing/compositing-dark";
import CompositingLight from "./compositing/compositing-light";

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

    const compositings = {};
    compositings[compositingNames.color] = new CompositingColor();
    compositings[compositingNames.dark] = new CompositingDark();
    compositings[compositingNames.light] = new CompositingLight();

    let totalPoints: number;
    function setTotalPoints(total: number): void {
        totalPoints = total;
        Canvas.setIndicatorText("points-drawn", totalPoints.toLocaleString());
    }
    setTotalPoints(0);

    let shouldComposeAgain: boolean;
    Parameters.shouldComposeAgainObservers.push(() => shouldComposeAgain = true);

    const STEP_SIZE = Math.pow(2, 16);
    let attractor: Attractor;
    let compositing: Compositing;
    function mainLoop() {
        if (needToAdjustCanvas) {
            needToAdjustCanvas = false;
            setTotalPoints(0);

            attractor = attractors[Parameters.attractor];
            attractor.reset();

            compositing = compositings[Parameters.compositing];
            compositing.initialize();

            Infos.setColors(compositing.foregroundColor, compositing.backgroundColor);
        }

        if (totalPoints < Parameters.nbPointsNeeded) {
            compositing.bindTopLayer();
            if (attractor.drawXPoints(STEP_SIZE)) {
                setTotalPoints(totalPoints + STEP_SIZE);
                compositing.compose();
            }
        }

        if (shouldComposeAgain) {
            shouldComposeAgain = false;
            compositing.updateColors();
            compositing.compose();
            Infos.setColors(compositing.foregroundColor, compositing.backgroundColor);
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
    }

    FileControl.addDownloadObserver(ControlsID.DOWNLOAD, () => {
        const figureSize = +Tabs.getValues(ControlsID.DOWNLOAD_SIZE)[0];

        const nbPointsNeeded = Parameters.computeNbPointsNeeded([figureSize, figureSize]);

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

            compositing.initialize();
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
        compositing.bindTopLayer();
        while (nbPoints < nbPointsNeeded) {
            nbPoints += stepSize;
            attractor.drawXPoints(stepSize);
        }
        compositing.compose();

        ctx2D.fillStyle = compositing.backgroundColor;
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
