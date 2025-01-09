"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import * as THREE from "three";
import "./styles.css";

export default function Page() {
  return (
    <div className="canvas-container">
      <Canvas>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />
        <Box position={[-1.2, 0, 0]} />
        <Box position={[1.2, 0, 0]} />
      </Canvas>
    </div>
  );
}

function Box(props: JSX.IntrinsicElements["mesh"]) {
  // This reference will give us direct access to the THREE.Mesh object
  const meshRef = useRef<THREE.Mesh>(null!);
  // Hold state for hovered and clicked events
  const [isHovered, setHovered] = useState(false);
  const [isClicked, setClicked] = useState(false);
  // Rotate mesh every frame, this is outside of React without overhead
  useFrame((_state, delta) => (meshRef.current.rotation.x += delta));

  return (
    <mesh
      {...props}
      ref={meshRef}
      scale={isClicked ? 1.5 : 1}
      onClick={() => setClicked(!isClicked)}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={isHovered ? "hotpink" : "orange"} />
    </mesh>
  );
}
