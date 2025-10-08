// useTrailTexture.js
import { useMemo, useRef } from "react";
import {
  HalfFloatType,
  Mesh,
  OrthographicCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  Vector2,
  WebGLRenderTarget,
} from "three";
import { useFrame, useThree } from "@react-three/fiber";

// You'll need to create these two new shader files
import trailFragmentShader from "./shaders/trailFragmentShader.glsl";
import trailVertexShader from "./shaders/trailVertexShader.glsl";

export function useTrailTexture({ size, fade = 0.01 }) {
  const { gl } = useThree();
  const scene = useMemo(() => new Scene(), []);
  const camera = useMemo(() => new OrthographicCamera(-1, 1, 1, -1, 0, 1), []);

  const resolution = useMemo(
    () => new Vector2(size.width, size.height),
    [size],
  );

  const renderTargets = useMemo(() => {
    const options = { type: HalfFloatType };
    return {
      read: new WebGLRenderTarget(resolution.x, resolution.y, options),
      write: new WebGLRenderTarget(resolution.x, resolution.y, options),
    };
  }, [resolution]);

  const aspectRatio = useMemo(() => size.width / size.height, [size]);

  const trailMaterial = useMemo(
    () =>
      new ShaderMaterial({
        uniforms: {
          uPreviousFrame: { value: null },
          uMouse: { value: new Vector2(0.5, 0.5) },
          uFade: { value: fade },
          uAspect: { value: aspectRatio },
        },
        vertexShader: trailVertexShader,
        fragmentShader: trailFragmentShader,
      }),
    [fade, aspectRatio],
  );

  const quad = useMemo(
    () => new Mesh(new PlaneGeometry(2, 2), trailMaterial),
    [trailMaterial],
  );
  scene.add(quad);

  const pointerRef = useRef(new Vector2(0.5, 0.5));

  useFrame(() => {
    trailMaterial.uniforms.uMouse.value.copy(pointerRef.current);
    trailMaterial.uniforms.uPreviousFrame.value = renderTargets.read.texture;

    gl.setRenderTarget(renderTargets.write);
    gl.render(scene, camera);
    gl.setRenderTarget(null);

    let temp = renderTargets.read;
    renderTargets.read = renderTargets.write;
    renderTargets.write = temp;
  });

  return {
    texture: renderTargets.read.texture,
    updatePointer: (e) => {
      if (e.touches && e.touches[0]) {
        pointerRef.current = {
          x: e.touches[0].clientX / size.width,
          y: 1 - e.touches[0].clientY / size.height,
        };
      } else {
        pointerRef.current = {
          x: e.clientX / size.width,
          y: 1 - e.clientY / size.height,
        };
      }
    },
    clearPointer: () => {
      pointerRef.current = { x: -9999, y: -9999 };
    },
  };
}
