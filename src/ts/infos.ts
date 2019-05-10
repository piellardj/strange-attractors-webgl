declare const Canvas: any;

const FONT_NAME = "Nothing You Could Do";
// const FONT_NAME = "Indie Flower";
// const FONT_NAME = "Tangerine";
// const FONT_NAME = "Architects Daughter";
// const FONT_NAME = "Coming Soon";
// const FONT_NAME = "Caveat";
// const FONT_NAME = "Kaushan Script";
// const FONT_NAME = "Covered By Your Grace";

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
        padding: 8px;
        text-align: left;
        color: white;
        font-family: '` + FONT_NAME + `', cursive;
        font-size: 20px;
    }
    .infos sub {
        font-size: 16px;
    }
    .infos div {
        padding: 8px;
        background: black;
    }
    .infos .attractor-name {
        display: inline-block;
        font-size: 24px;
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

const infosBlockElt = document.createElement("div");
infosBlockElt.className = "infos";
infosBlockElt.appendChild(titleElt);
infosBlockElt.appendChild(formulaElt);
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

export {
    setFormula,
    setTitle,
    setVisibility,
};
