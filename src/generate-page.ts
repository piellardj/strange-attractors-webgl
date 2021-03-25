import * as fs from "fs";
import * as path from "path";
import { Demopage } from "webpage-templates";

const data = {
    title: "Strange attractors",
    description: "Dynamic and interactive strange attractors drawings",
    introduction: [
        "Strange attractors are complex mathematical figures representing the path traced by a point iteratively moved following strict rules. Strange attractors often exhibit beautiful fractal patterns. The figures drawn in this experiment are the superposition of many different trajectories from random starting points.",
        "This project supports various attractor types, and for each of them you can change the parameters and watch unique patterns appear."
    ],
    githubProjectName: "strange-attractors-webgl",
    additionalLinks: [],
    scriptFiles: [
        "script/main.min.js"
    ],
    indicators: [
        {
            id: "points-drawn",
            label: "Total drawn points"
        }
    ],
    canvas: {
        width: 512,
        height: 512,
        enableFullscreen: true
    },
    controlsSections: [
        {
            title: "Parameters",
            controls: [
                {
                    type: Demopage.supportedControls.Picker,
                    title: "Attractor",
                    id: "attractor-picker-id",
                    placeholder: "none",
                    options: [
                        {
                            value: "de-jong",
                            label: "De Jong"
                        },
                        {
                            value: "bedhead",
                            label: "Bedhead"
                        },
                        {
                            value: "clifford",
                            label: "Clifford"
                        },
                        {
                            value: "fractal-dream",
                            label: "Fractal Dream"
                        }
                    ]
                },
                {
                    type: Demopage.supportedControls.Range,
                    title: "a",
                    id: "a-range-id",
                    min: -5,
                    max: 5,
                    value: 3,
                    step: 0.01
                },
                {
                    type: Demopage.supportedControls.Range,
                    title: "b",
                    id: "b-range-id",
                    min: -5,
                    max: 5,
                    value: 1.25,
                    step: 0.01
                },
                {
                    type: Demopage.supportedControls.Range,
                    title: "c",
                    id: "c-range-id",
                    min: -5,
                    max: 5,
                    value: 1.58,
                    step: 0.01
                },
                {
                    type: Demopage.supportedControls.Range,
                    title: "d",
                    id: "d-range-id",
                    min: -5,
                    max: 5,
                    value: 1.72,
                    step: 0.01
                }
            ]
        },
        {
            title: "Rendering",
            controls: [
                {
                    type: Demopage.supportedControls.Range,
                    title: "Intensity",
                    id: "intensity-range-id",
                    min: 1,
                    max: 100,
                    value: 30,
                    step: 1
                },
                {
                    type: Demopage.supportedControls.Range,
                    title: "Quality",
                    id: "quality-range-id",
                    min: 0,
                    max: 1,
                    value: 1,
                    step: 0.01
                },
                {
                    type: Demopage.supportedControls.Checkbox,
                    title: "Show indicators",
                    id: "indicators-checkbox-id",
                    checked: true
                },
                {
                    type: Demopage.supportedControls.Checkbox,
                    title: "Show formula",
                    id: "formula-checkbox-id",
                    checked: false
                }
            ]
        },
        {
            title: "Composition",
            controls: [
                {
                    type: Demopage.supportedControls.Tabs,
                    title: "Theme",
                    id: "compositing",
                    unique: true,
                    options: [
                        {
                            value: "dark",
                            label: "Dark"
                        },
                        {
                            value: "light",
                            label: "Light",
                            checked: true
                        },
                        {
                            value: "color",
                            label: "Color"
                        }
                    ]
                },
                {
                    type: Demopage.supportedControls.ColorPicker,
                    title: "Foreground",
                    id: "foreground-range-id",
                    defaultValueHex: "#485BFC"
                },
                {
                    type: Demopage.supportedControls.ColorPicker,
                    title: "Background",
                    id: "background-range-id",
                    defaultValueHex: "#AED9B5"
                }
            ]
        },
        {
            title: "Download",
            controls: [
                {
                    type: Demopage.supportedControls.Tabs,
                    title: "Image size",
                    id: "download-size",
                    unique: true,
                    options: [
                        {
                            value: "1024",
                            label: "1024",
                            checked: true
                        },
                        {
                            value: "2048",
                            label: "2048"
                        },
                        {
                            value: "4096",
                            label: "4096"
                        }
                    ]
                },
                {
                    type: Demopage.supportedControls.FileDownload,
                    id: "file-download-id",
                    label: "Download image"
                }
            ]
        }
    ]
};

const DEST_DIR = path.resolve(__dirname, "..", "docs");
const minified = true;

const buildResult = Demopage.build(data, DEST_DIR, {
    debug: !minified,
});

// disable linting on this file because it is generated
buildResult.pageScriptDeclaration = "/* tslint:disable */\n" + buildResult.pageScriptDeclaration;

const SCRIPT_DECLARATION_FILEPATH = path.resolve(__dirname, ".", "ts", "page-interface-generated.ts");
fs.writeFileSync(SCRIPT_DECLARATION_FILEPATH, buildResult.pageScriptDeclaration);
