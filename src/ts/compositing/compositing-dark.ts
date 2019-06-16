import * as GLCanvas from "../gl-utils/gl-canvas";
import { gl } from "../gl-utils/gl-canvas";
import Viewport from "../gl-utils/viewport";

import CompositingBase from "./compositing";

class CompositingDark extends CompositingBase {
    public initialize(): void {
        gl.clearColor(0, 0, 0, 1);

        gl.enable(gl.BLEND);
        gl.blendFunc(gl.ONE, gl.ONE);
        gl.blendEquation(gl.FUNC_ADD);

        GLCanvas.adjustSize();
        Viewport.setFullCanvas(gl);
        gl.clear(gl.COLOR_BUFFER_BIT);
    }

    /* tslint:disable:no-empty */
    public bindTopLayer(): void {}
    public compose(): void {}
    /* tslint:enable:no-empty */
}

export default CompositingDark;
