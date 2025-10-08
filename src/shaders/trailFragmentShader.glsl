// shaders/trailFragmentShader.glsl
uniform sampler2D uPreviousFrame;
uniform vec2 uMouse;
uniform float uFade;
uniform float uAspect; // NEW UNIFORM

varying vec2 vUv;

void main() {
  // 1. Sample and Fade
  vec4 previousColor = texture2D(uPreviousFrame, vUv);
  vec4 fadedColor = previousColor - uFade;

  // --- 2. Calculate Scaled Distance ---

  // A. Create a scaled UV position vector
  // We scale the X-axis by the aspect ratio to make a square area look square.
  // We need to center the scaling, so we shift to [-0.5, 0.5] range, scale, and shift back.

  vec2 centeredUv = vUv - 0.5;
  vec2 scaledUv = vec2(centeredUv.x * uAspect, centeredUv.y);

  vec2 centeredMouse = uMouse - 0.5;
  vec2 scaledMouse = vec2(centeredMouse.x * uAspect, centeredMouse.y);

  // B. Calculate distance in the scaled space
  float dist = distance(scaledUv, scaledMouse);

  // Use smoothstep to create a soft-edged circle.
  float radius = 0.15;
  float newDot = 1.0 - smoothstep(0.0, radius, dist);

  // 3. Combine and Output
  float finalMask = max(fadedColor.r, newDot);

  gl_FragColor = vec4(vec3(finalMask), 1.0);
}
