uniform sampler2D uTrailTexture;
uniform float uExtrusionAmount;

varying float vMask;

void main() {
  vec4 clipPos = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  vec2 screenUV = clipPos.xy / clipPos.w * 0.5 + 0.5;

  float mask = texture2D(uTrailTexture, screenUV).r;

  vMask = mask;

  vec3 pos = position;
  pos.y *= mix(uExtrusionAmount, 1.0, vMask);
  pos.xz *= 1.004;

  csm_Position = pos;
}
