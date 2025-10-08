import { Canvas } from "@react-three/fiber";
import { Scene } from "./Scene";

export default function App() {
  return (
    <Canvas shadows className="bg-black" camera={{ position: [0, 1.5, 0] }}>
      <ambientLight intensity={2} />
      <Scene />
    </Canvas>
  );
}
