"use client";

import {
  ContactShadows,
  OrbitControls,
  PerspectiveCamera,
  RenderTexture,
  Text,
} from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import * as THREE from "three";

export default function Page() {
  return (
    <Canvas camera={{ position: [5, 5, 5], fov: 25 }}>
      <ambientLight intensity={Math.PI / 2} />
      <directionalLight position={[10, 10, 5]} intensity={Math.PI} />

      <Cube />
      <Dodecahedron position={[0, 1, 0]} scale={0.2} />
      <ContactShadows
        frames={1}
        position={[0, -0.5, 0]}
        blur={1}
        opacity={0.75}
      />
      <ContactShadows
        frames={1}
        position={[0, -0.5, 0]}
        blur={3}
        color="orange"
      />

      <OrbitControls minPolarAngle={0} maxPolarAngle={Math.PI / 2.1} />
    </Canvas>
  );
}

function Cube() {
  const textRef = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    textRef.current.position.x = Math.sin(state.clock.elapsedTime) * 2;
  });

  return (
    <mesh>
      <boxGeometry />
      <meshStandardMaterial>
        <RenderTexture attach="map" anisotropy={16}>
          <PerspectiveCamera
            makeDefault
            manual
            aspect={1 / 1}
            position={[0, 0, 5]}
          />
          <color attach="background" args={["orange"]} />
          <ambientLight intensity={Math.PI / 2} />
          <directionalLight position={[10, 10, 5]} intensity={Math.PI} />
          <Text ref={textRef} fontSize={4} color="#555">
            Hello
          </Text>
          <Dodecahedron />
        </RenderTexture>
      </meshStandardMaterial>
    </mesh>
  );
}

function Dodecahedron(props: JSX.IntrinsicElements["group"]) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [isHovered, setHovered] = useState(false);
  const [isClicked, setClicked] = useState(false);
  useFrame((_state, delta) => {
    meshRef.current.rotation.x += delta;
  });

  return (
    <group {...props}>
      <mesh
        ref={meshRef}
        scale={isClicked ? 1.5 : 1}
        onClick={() => setClicked(!isClicked)}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <dodecahedronGeometry args={[0.75]} />
        <meshStandardMaterial color={isHovered ? "hotpink" : "#5de4c7"} />
      </mesh>
    </group>
  );
}
