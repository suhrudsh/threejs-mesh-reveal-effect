import * as THREE from "three";
import { Helper, useGLTF, useTexture } from "@react-three/drei";
import { useMemo, useEffect } from "react";
import CustomShaderMaterial from "three-custom-shader-material";
import { useTrailTexture } from "./useTrailTexture";
import vertexShader from "./shaders/vertexShader.glsl";
import fragmentShader from "./shaders/fragmentShader.glsl";
import planeVertexShader from "./shaders/planeVertexShader.glsl";
import planeFragmentShader from "./shaders/planeFragmentShader.glsl";
import { useThree } from "@react-three/fiber";

export function Scene(props) {
  const { nodes, materials } = useGLTF(
    `${import.meta.env.BASE_URL}threejs-mesh-reveal-effect-scene.glb`,
  );

  // Trail texture & mouse
  const { size } = useThree();
  const {
    texture: trailTexture,
    updatePointer,
    clearPointer,
  } = useTrailTexture({ size });

  useEffect(() => {
    const handlePointer = (e) => {
      updatePointer(e);
    };

    window.addEventListener("mousemove", handlePointer);
    window.addEventListener("mouseleave", clearPointer);
    window.addEventListener("touchmove", handlePointer, { passive: true });
    window.addEventListener("touchend", clearPointer, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handlePointer);
      window.removeEventListener("mouseleave", clearPointer);
      window.removeEventListener("touchmove", handlePointer);
      window.removeEventListener("touchend", clearPointer);
    };
  }, [size, updatePointer, clearPointer]);

  // Load baked shadow texture
  const shadowBake = useTexture(`${import.meta.env.BASE_URL}shadow-bake.webp`);

  // Shader uniforms for plane
  const planeUniforms = useMemo(
    () => ({
      uTrailTexture: { value: trailTexture },
      uShadowTexture: { value: shadowBake },
    }),
    [trailTexture, shadowBake],
  );

  // Shader uniforms for other meshes
  const shaderUniforms = useMemo(
    () => ({
      uTrailTexture: { value: trailTexture },
      uExtrusionAmount: { value: 0.05 },
    }),
    [trailTexture],
  );

  const shaderNodes = [
    nodes.Cylinder,
    nodes.Sphere,
    nodes.Sphere001,
    nodes.Sphere002,
    nodes.Sphere003,
    nodes.Sphere005,
    nodes.Cylinder001,
    nodes.Cylinder003,
    nodes.Cylinder004,
  ];

  return (
    <group {...props} dispose={null}>
      <directionalLight intensity={5} position={[5.4, 3.3, 7.7]} />

      {/* Plane with shadow bake and trail mask */}
      <mesh geometry={nodes.Plane.geometry}>
        <CustomShaderMaterial
          baseMaterial={THREE.MeshPhysicalMaterial}
          uniforms={planeUniforms}
          vertexShader={planeVertexShader}
          fragmentShader={planeFragmentShader}
          map={materials["Marble.001"].map}
          roughness={materials["Marble.001"].roughness}
          metalness={materials["Marble.001"].metalness}
          normalMap={materials["Marble.001"].normalMap}
          roughnessMap={materials["Marble.001"].roughnessMap}
          envMap={materials["Marble.001"].envMap}
          transparent={true}
        />
      </mesh>

      {/* Other meshes with custom shader */}
      {shaderNodes.map((node, i) => (
        <mesh
          key={i}
          geometry={node.geometry}
          position={node.position}
          rotation={node.rotation}
        >
          <CustomShaderMaterial
            baseMaterial={THREE.MeshPhysicalMaterial}
            uniforms={shaderUniforms}
            vertexShader={vertexShader}
            fragmentShader={fragmentShader}
            transparent={true}
            roughness={materials.Marble.roughness}
            metalness={materials.Marble.metalness}
            map={materials.Marble.map}
            normalMap={materials.Marble.normalMap}
            roughnessMap={materials.Marble.roughnessMap}
            envMap={materials.Marble.envMap}
          />
        </mesh>
      ))}
    </group>
  );
}

useGLTF.preload(
  `${import.meta.env.BASE_URL}threejs-mesh-reveal-effect-scene.glb`,
);
