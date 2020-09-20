import * as Infos from "./infos";

import "./page-interface-generated";

const attractorNames = {
    DeJong: "de-jong",
    Bedhead: "bedhead",
    Clifford: "clifford",
    FractalDream: "fractal-dream",
};

const compositingNames = {
    dark: "dark",
    light: "light",
    color: "color",
};

/* === IDs ============================================================ */
const controlId = {
    ATTRACTOR: "attractor-picker-id",
    A: "a-range-id",
    B: "b-range-id",
    C: "c-range-id",
    D: "d-range-id",
    FORMULA: "formula-checkbox-id",
    INDICATORS: "indicators-checkbox-id",
    INTENSITY: "intensity-range-id",
    QUALITY: "quality-range-id",
    COMPOSITING: "compositing",
    FOREGROUND: "foreground-range-id",
    BACKGROUND: "background-range-id",
    DOWNLOAD_SIZE: "download-size",
    DOWNLOAD: "file-download-id",
};

/* === OBSERVERS ====================================================== */
type GenericObserver = () => void;

function callObservers(observersList: any[]): void {
    for (const observer of observersList) {
        observer();
    }
}

const observers: {
    clear: GenericObserver[],
    shouldComposeAgain: GenericObserver[],
} = {
    clear: [],
    shouldComposeAgain: [],
};

let attractor: string;
let a: number;
let b: number;
let c: number;
let d: number;

let intensity: number;
let quality: number;
let compositing: string;
let foregroundHue: number;
let backgroundHue: number;
let nbPointsNeeded: number;

function updateNbPointsNeeded() {
    nbPointsNeeded = Parameters.computeNbPointsNeeded(Page.Canvas.getSize());
}

function setCompositing(name: string) {
    const isColor = (name === compositingNames.color);
    Page.Controls.setVisibility(controlId.FOREGROUND, isColor);
    Page.Controls.setVisibility(controlId.BACKGROUND, isColor);

    compositing = name;
    callObservers(observers.clear);
}

/* === INTERFACE ====================================================== */
class Parameters {
    public static get attractor(): string {
        return attractor;
    }
    public static set attractor(att: string) {
        Page.Picker.setValue(controlId.ATTRACTOR, att);
        attractor = att;
    }

    public static get a(): number {
        return a;
    }

    public static get b(): number {
        return b;
    }

    public static get c(): number {
        return c;
    }

    public static get d(): number {
        return d;
    }

    public static get nbPointsNeeded(): number {
        return nbPointsNeeded;
    }

    public static get quality(): number {
        return quality;
    }

    public static get compositing(): string {
        return compositing;
    }

    public static get foregroundHue(): number {
        return foregroundHue;
    }

    public static get backgroundHue(): number {
        return backgroundHue;
    }

    public static get clearObservers(): GenericObserver[] {
        return observers.clear;
    }

    public static get shouldComposeAgainObservers(): GenericObserver[] {
        return observers.shouldComposeAgain;
    }

    public static computeNbPointsNeeded(canvasSize: number[]): number {
        const minDimension = Math.min(canvasSize[0], canvasSize[1]);
        return intensity / (256 * quality) * minDimension * minDimension;
    }

    private constructor() {}
}

/* === EVENTS BINDING ================================================= */
/* --- PARAMETERS ----------------------------------------------------- */
Page.Picker.addObserver(controlId.ATTRACTOR, (value: string) => {
    attractor = value;
    callObservers(observers.clear);
});

Page.Range.addObserver(controlId.A, (newvalue: number) => {
    a = newvalue;
    callObservers(observers.clear);
});
a = Page.Range.getValue(controlId.A);

Page.Range.addObserver(controlId.B, (newvalue: number) => {
    b = newvalue;
    callObservers(observers.clear);
});
b = Page.Range.getValue(controlId.B);

Page.Range.addObserver(controlId.C, (newvalue: number) => {
    c = newvalue;
    callObservers(observers.clear);
});
c = Page.Range.getValue(controlId.C);

Page.Range.addObserver(controlId.D, (newvalue: number) => {
    d = newvalue;
    callObservers(observers.clear);
});
d = Page.Range.getValue(controlId.D);

Page.Checkbox.addObserver(controlId.FORMULA, (checked: boolean) => {
    Infos.setVisibility(checked);
});
Infos.setVisibility(Page.Checkbox.isChecked(controlId.FORMULA));

Page.Range.addObserver(controlId.INTENSITY, (newvalue: number) => {
    const needToClear = (newvalue < intensity);
    intensity = newvalue;
    updateNbPointsNeeded();

    if (needToClear) {
        callObservers(observers.clear);
    }
});
intensity = Page.Range.getValue(controlId.INTENSITY);

Page.Range.addObserver(controlId.QUALITY, (newvalue: number) => {
    quality = 1 - (254 / 255) * newvalue;
    updateNbPointsNeeded();
    callObservers(observers.clear);
});
quality = 1 - (254 / 255) * Page.Range.getValue(controlId.QUALITY);

Page.Tabs.addObserver(controlId.COMPOSITING, (newValue: string[]) => {
    setCompositing("" + newValue[0]);
});
setCompositing("" + Page.Tabs.getValues(controlId.COMPOSITING));

Page.Range.addObserver(controlId.FOREGROUND, (newValue: number) => {
    foregroundHue = newValue;
    callObservers(observers.shouldComposeAgain);
});
foregroundHue = Page.Range.getValue(controlId.FOREGROUND);

Page.Range.addObserver(controlId.BACKGROUND, (newValue: number) => {
    backgroundHue = newValue;
    callObservers(observers.shouldComposeAgain);
});
backgroundHue = Page.Range.getValue(controlId.BACKGROUND);

Page.Checkbox.addObserver(controlId.INDICATORS, (checked: boolean) => {
    Page.Canvas.setIndicatorsVisibility(checked);
});
Page.Canvas.setIndicatorsVisibility(Page.Checkbox.isChecked(controlId.INDICATORS));

Page.Canvas.Observers.canvasResize.push(updateNbPointsNeeded);
updateNbPointsNeeded();

export {
    attractorNames,
    compositingNames,
    controlId as ControlsID,
    Parameters,
};
