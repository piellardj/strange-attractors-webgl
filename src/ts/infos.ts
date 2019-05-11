declare const Canvas: any;

const FONT_NAME = "Nothing You Could Do";
const BLOCK_MARGIN = 8;
const BLOCK_PADDING = 8;
const TITLE_FONT_SIZE = 24;
const FONT_SIZE = 20;
const SUB_FONT_SIZE = 16;

(function registerFont() {
    const fontLink = document.createElement("link");
    fontLink.href = "https://fonts.googleapis.com/css?family=" + FONT_NAME.replace(" ", "+");
    fontLink.rel = "stylesheet";
    document.head.appendChild(fontLink);
})();

(function registerCss() {
    const infosCss =
        `.infos {
        position: absolute;
        bottom: 0;
        left: 0;
        line-height: 1em;
        margin: ` + BLOCK_MARGIN + `px;
        text-align: left;
        color: white;
        font-family: '` + FONT_NAME + `', cursive;
        font-size: ` + FONT_SIZE + `px;
    }
    .infos sub {
        font-size: ` + SUB_FONT_SIZE + `px;
    }
    .infos div {
        padding: ` + BLOCK_PADDING + `px;
        background: black;
    }
    .infos .attractor-name {
        display: inline-block;
        font-size: ` + TITLE_FONT_SIZE + `px;
    }
    .infos .attractor-parameters {
        display: inline-block;
    }`;

    const infosStyle = document.createElement("style");
    infosStyle.setAttribute("type", "text/css");
    if ((infosStyle as any).styleSheet) {   // IE
        (infosStyle as any).styleSheet.cssText = infosCss;
    } else {
        infosStyle.appendChild(document.createTextNode(infosCss));
    }
    document.head.appendChild(infosStyle);
})();

const titleElt = document.createElement("div");
titleElt.className = "attractor-name";
const formulaElt = document.createElement("div");
const parametersElt = document.createElement("div");
parametersElt.className = "attractor-parameters";

const infosBlockElt = document.createElement("div");
infosBlockElt.className = "infos";
infosBlockElt.appendChild(titleElt);
infosBlockElt.appendChild(formulaElt);
infosBlockElt.appendChild(parametersElt);
setVisibility(false);

const canvasContainer = (Canvas.getCanvas() as HTMLElement).parentElement;
canvasContainer.appendChild(infosBlockElt);

function setVisibility(visible: boolean) {
    infosBlockElt.style.display = visible ? "" : "none";
}

function setTitle(title: string) {
    titleElt.textContent = title;
}

function setFormula(formula: string) {
    function frame(op: string, f: string) {
        return f + op + f;
    }
    function frameNode(op: string, node: string) {
        return "<" + node + ">" + op + "</" + node + ">";
    }

    const SPACE = " ";
    const HALF_SPACE = "&#8239;";

    let html = formula.replace(/\s*\*\s*/g, frame("&times", HALF_SPACE));
    html = html.replace(/\s*\/\s*/g, frame("&divide", HALF_SPACE));
    html = html.replace(/\s*\+\s*/g, frame("+", SPACE));
    html = html.replace(/\s*-\s*/g, frame("-", SPACE));
    html = html.replace(/\s*=\s*/g, frame("=", SPACE));
    html = html.replace(/\s*n\s*\+\s*1\s*/g, "n" + frame("+", HALF_SPACE) + "1");
    html = html.replace(/\n/g, "<br/>");
    html = html.replace(/_{([^}]*)}/g, (str, $1) => frameNode($1, "sub"));
    html = html.replace(/\^{([^}]*)}/g, (str, $1) => frameNode($1, "sup"));

    formulaElt.innerHTML = html;
}

function setParameters(parameters: string[]) {
    parametersElt.innerHTML = parameters.join("<br/>");
}

function drawToCanvas(ctx: CanvasRenderingContext2D) {
    function setFontSize(sizeInPx: number) {
        ctx.font = sizeInPx + "px " + FONT_NAME;
    }

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, 1024, 1024);
    ctx.fillStyle = "red";
    ctx.fillRect(BLOCK_MARGIN, BLOCK_MARGIN, titleElt.clientWidth, titleElt.clientHeight);
    ctx.fillStyle = "white";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";

    const blockLeft = BLOCK_MARGIN + BLOCK_PADDING;
    let top = BLOCK_MARGIN + BLOCK_PADDING;

    let fontSize = TITLE_FONT_SIZE;
    setFontSize(fontSize);
    ctx.fillText(titleElt.textContent, blockLeft, top);
    top += 2 * FONT_SIZE;

    fontSize = FONT_SIZE;
    setFontSize(fontSize);

    ctx.fillStyle = "red";
    ctx.fillRect(BLOCK_MARGIN, top - BLOCK_PADDING, formulaElt.clientWidth, formulaElt.clientHeight);

    ctx.fillStyle = "white";
    /* HTML tags cannot be used when drawing text on a canvas,
     * so we need to handle manually tags such as br and sub. */
    formulaElt.innerHTML.split(/\s*<br\/?>\s*/g).forEach((str) => {
        let dLeft = 0;
        let currIndex = 0;

        function writeText(text: string) {
            ctx.fillText(text, blockLeft + dLeft, top);
            dLeft += ctx.measureText(text).width;
        }

        function findNext(nodeName: string) {
            const i = str.indexOf(nodeName, currIndex);
            return (i < 0) ? str.length : i;
        }

        while (currIndex < str.length) {
            let index = findNext("<sub>");
            writeText(str.substring(currIndex, index));
            currIndex = index + 5; // 5 === "<sub>".length

            index = findNext("</sub>");
            top += .4 * fontSize;
            setFontSize(SUB_FONT_SIZE);
            writeText(str.substring(currIndex, index));
            top -= .4 * fontSize;
            currIndex = index + 6; // 6 === "</sub>".length

            setFontSize(fontSize);
        }
        top += 1.25 * fontSize;
    });

    top += 1 * FONT_SIZE;

    ctx.fillStyle = "red";
    ctx.fillRect(BLOCK_MARGIN, top - BLOCK_PADDING, parametersElt.clientWidth, parametersElt.clientHeight);

    ctx.fillStyle = "white";
    parametersElt.innerHTML.split(/\s*<br\/?>\s*/g).forEach((line) => {
        ctx.fillText(line, blockLeft, top);
        top += 1 * fontSize;
    });
}

export {
    drawToCanvas,
    setFormula,
    setParameters,
    setTitle,
    setVisibility,
};
