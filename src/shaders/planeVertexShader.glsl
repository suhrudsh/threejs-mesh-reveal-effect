// planeVertexShader.glsl

varying vec2 vUv;
varying vec2 vShadowUv;
// Change vMask to a vec4 to pass the clip space position
varying vec4 vClipPosition;

void main() {
  vUv = uv;
  vShadowUv = vec2(uv.x, 1.0 - uv.y);

  // Calculate the final position
  vec4 clipPos = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

  // Pass the raw clip position (before division) to the fragment shader
  vClipPosition = clipPos;

  gl_Position = clipPos;
}
