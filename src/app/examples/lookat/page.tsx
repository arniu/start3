"use client";

import { Text } from "@react-three/drei";
import { Canvas, ThreeElements, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";

const arrayOf = (length: number) => Array.from({ length });

export default function Page() {
  return (
    <Canvas camera={{ position: [0, 0, 6] }}>
      <directionalLight position={[0, 0, 1]} />

      {arrayOf(5).map((_, i) => (
        <group key={`Row${i}`}>
          {arrayOf(6).map((_, j) => (
            <Box
              key={`${i}-${j}`}
              position={[j * 2 - 5, i * 1.5 - 3, 0]}
              // text={`${i},${j}`}
            />
          ))}
        </group>
      ))}

      <Rig />
    </Canvas>
  );
}

function Rig() {
  const vec = new THREE.Vector3();
  const { camera, pointer } = useThree();

  return useFrame(() => {
    vec.set(pointer.x, pointer.y, camera.position.z);
    camera.position.lerp(vec, 0.05);
    camera.lookAt(0, 0, 0);
  });
}

type BoxProps = ThreeElements["mesh"] & {
  text?: string;
};

function Box({ text, ...props }: BoxProps) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const lime = useMemo(() => new THREE.Color("lime"), []);
  const orange = useMemo(() => new THREE.Color("orange"), []);
  const [hovered, setHovered] = useState(false);

  useFrame(({ pointer, viewport }) => {
    const x = (pointer.x * viewport.width) / 2.5;
    const y = (pointer.y * viewport.height) / 2.5;
    const material = meshRef.current.material as THREE.MeshStandardMaterial;
    material.color.lerp(hovered ? orange : lime, 0.05);
    meshRef.current.lookAt(x, y, 1);
  });

  return (
    <mesh
      {...props}
      ref={meshRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <boxGeometry />
      <meshPhongMaterial color={lime} />
      {/* 加上文字后，文字闪烁，似乎有问题 */}
      <Text fontSize={0.5} position-z={0.5} visible={!!text}>
        {text}
      </Text>
    </mesh>
  );
}
