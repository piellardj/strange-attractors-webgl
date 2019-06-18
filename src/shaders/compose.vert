attribute vec2 aCorner; // {-1,1}x{-1,1}

varying vec2 vCoords;

void main(void)
{
    vCoords =  .5 * aCorner + .5;
    gl_Position = vec4(aCorner, 0, 1);
}
