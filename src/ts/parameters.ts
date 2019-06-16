import * as Infos from "./infos";

declare const Button: any;
declare const Canvas: any;
declare const Checkbox: any;
declare const Controls: any;
declare const FileControl: any;
declare const Picker: any;
declare const Range: any;
declare const Tabs: any;

const attractorNames = {
    DeJong: "de-jong",
    Bedhead: "bedhead",
    Clifford: "clifford",
    FractalDream: "fractal-dream",
};

const compositingNames = {
    dark: "dark",
    light: "light",
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
} = {
    clear: [],
};

let attractor: string;
let a: number;
let b: number;
let c: number;
let d: number;

let intensity: number;
let quality: number;
let compositing: string;
let nbPointsNeeded: number;

function updateNbPointsNeeded() {
    nbPointsNeeded = Parameters.computeNbPointsNeeded(Canvas.getSize());
}

/* === INTERFACE ====================================================== */
class Parameters {
    public static get attractor(): string {
        return attractor;
    }
    public static set attractor(att: string) {
        Picker.setValue(controlId.ATTRACTOR, att);
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

    public static get clearObservers(): GenericObserver[] {
        return observers.clear;
    }

    public static computeNbPointsNeeded(canvasSize: number[]): number {
        const minDimension = Math.min(canvasSize[0], canvasSize[1]);
        return intensity / (256 * quality) * minDimension * minDimension;
    }

    private constructor() {}
}

/* === EVENTS BINDING ================================================= */
/* --- PARAMETERS ----------------------------------------------------- */
Picker.addObserver(controlId.ATTRACTOR, (value: string) => {
    attractor = value;
    callObservers(observers.clear);
});

Range.addObserver(controlId.A, (newvalue: number) => {
    a = newvalue;
    callObservers(observers.clear);
});
a = Range.getValue(controlId.A);

Range.addObserver(controlId.B, (newvalue: number) => {
    b = newvalue;
    callObservers(observers.clear);
});
b = Range.getValue(controlId.B);

Range.addObserver(controlId.C, (newvalue: number) => {
    c = newvalue;
    callObservers(observers.clear);
});
c = Range.getValue(controlId.C);

Range.addObserver(controlId.D, (newvalue: number) => {
    d = newvalue;
    callObservers(observers.clear);
});
d = Range.getValue(controlId.D);

Checkbox.addObserver(controlId.FORMULA, (checked: boolean) => {
    Infos.setVisibility(checked);
});
Infos.setVisibility(Checkbox.isChecked(controlId.FORMULA));

Range.addObserver(controlId.INTENSITY, (newvalue: number) => {
    const needToClear = (newvalue < intensity);
    intensity = newvalue;
    updateNbPointsNeeded();

    if (needToClear) {
        callObservers(observers.clear);
    }
});
intensity = Range.getValue(controlId.INTENSITY);

Range.addObserver(controlId.QUALITY, (newvalue: number) => {
    quality = 1 - (254 / 255) * newvalue;
    updateNbPointsNeeded();
    callObservers(observers.clear);
});
quality = 1 - (254 / 255) * Range.getValue(controlId.QUALITY);

Tabs.addObserver(controlId.COMPOSITING, (newValue: string[]) => {
    compositing = "" + newValue[0];
    callObservers(observers.clear);
});
compositing = "" + Tabs.getValues(controlId.COMPOSITING);

Checkbox.addObserver(controlId.INDICATORS, (checked: number) => {
    Canvas.setIndicatorsVisibility(checked);
});
Canvas.setIndicatorsVisibility(Checkbox.isChecked(controlId.INDICATORS));

Canvas.Observers.canvasResize.push(updateNbPointsNeeded);
updateNbPointsNeeded();

export {
    attractorNames,
    compositingNames,
    controlId as ControlsID,
    Parameters,
};
