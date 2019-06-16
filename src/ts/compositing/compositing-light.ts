import * as GLCanvas from "../gl-utils/gl-canvas";
import { gl } from "../gl-utils/gl-canvas";
import Viewport from "../gl-utils/viewport";

import CompositingBase from "./compositing";

class CompositingLight extends CompositingBase {
    public initialize(): void {
        gl.clearColor(1, 1, 1, 1);

        gl.enable(gl.BLEND);
        gl.blendFunc(gl.ONE, gl.ONE);
        gl.blendEquation(gl.FUNC_REVERSE_SUBTRACT);

        GLCanvas.adjustSize();
        Viewport.setFullCanvas(gl);
        gl.clear(gl.COLOR_BUFFER_BIT);
    }

    public bindTopLayer(): void {}
    public compose(): void {}
}

export default CompositingLight;