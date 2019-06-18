precision lowp float;

uniform sampler2D uTexture;

uniform vec4 uForegroundColor;
uniform vec4 uBackgroundColor;

varying vec2 vCoords;

void main(void)
{
    float value = texture2D(uTexture, vCoords).r;
    gl_FragColor = mix(uBackgroundColor, uForegroundColor, value);
}