// planeFragmentShader.glsl

uniform sampler2D uTrailTexture;
uniform sampler2D uShadowTexture;
varying vec2 vUv;
varying vec2 vShadowUv;
varying vec4 vClipPosition;

void main() {
  // 1. Calculate Screen UV & Mask
  vec2 screenUV = vClipPosition.xy / vClipPosition.w * 0.5 + 0.5;
  float mask = texture2D(uTrailTexture, screenUV).r;

  // 2. Define Base Colors
  vec4 baseColor = texture2D(map, vUv);
  vec4 rawShadowTex = texture2D(uShadowTexture, vShadowUv);

  // --- Define the two colors to blend between ---

  // Color A: The color OUTSIDE the trail (mask = 0)
  // Desired: Normal Base Color (Fully Lit, No Shadow)
  vec4 colorA = baseColor;

  // Color B: The color INSIDE the trail (mask = 1)
  // Desired: Shadowed AND Slightly Darkened Base Color

  // Define the extra darkening factor (e.g., 0.8 for 20% darker)
  float extraDarkeningFactor = 0.9;

  // Step 1: Apply the baked shadow
  vec4 shadowedColor = baseColor * rawShadowTex;

  // Step 2: Apply the slight extra darkening
  vec4 darkenedShadowedColor = shadowedColor * extraDarkeningFactor;

  vec4 colorB = darkenedShadowedColor;

  // 3. Blend the Colors using the Mask
  // mix(colorA, colorB, mask):
  // - Where mask=0, we get colorA (Normal Base Color)
  // - Where mask=1, we get colorB (Shadowed + Darkened)
  vec4 finalColor = mix(colorA, colorB, mask);

  csm_DiffuseColor = finalColor;
}
