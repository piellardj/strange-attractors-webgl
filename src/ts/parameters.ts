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
};

/* === IDs ============================================================ */
const controlId = {
    ATTRACTOR: "attractor-picker-id",
    A: "a-range-id",
    B: "b-range-id",
    C: "c-range-id",
    D: "d-range-id",
    AUTORUN: "autorun-checkbox-id",
    QUALITY: "quality-range-id",
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

let autorun: boolean;
let quality: number;

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

    public static get autorun(): boolean {
        return autorun;
    }

    public static get quality(): number {
        return quality;
    }

    public static get clearObservers(): GenericObserver[] {
        return observers.clear;
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

Checkbox.addObserver(controlId.AUTORUN, (checked: boolean) => {
    autorun = checked;
});
autorun = Checkbox.isChecked(controlId.AUTORUN);

Range.addObserver(controlId.QUALITY, (newvalue: number) => {
    quality = newvalue;
    callObservers(observers.clear);
});
quality = Range.getValue(controlId.QUALITY);

export {
    attractorNames,
    controlId as ControlsID,
    Parameters,
};
