uniform vec2 uCenter;
uniform vec2 uScale;

attribute vec2 aCoords; // {-2,2}x{-2,2}

void main(void)
{
    vec2 coord = (aCoords - uCenter) * uScale;
    gl_PointSize = 1.0;
    gl_Position = vec4(coord, 0, 1);
}
