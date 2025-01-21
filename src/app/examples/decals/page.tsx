"use client";

import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";

import { LeePerrySmith } from "./model";

// https://threejs.org/examples/#webgl_decals
export default function Page() {
  return (
    <Canvas camera={{ fov: 45, near: 1, far: 1000, position: [0, 0, 120] }}>
      <ambientLight color={0x666666} />

      <directionalLight
        color={0xffddcc}
        intensity={3}
        position={[1, 0.75, 0.5]}
      />
      <directionalLight
        color={0xccccff}
        intensity={3}
        position={[-1, 0.75, -0.5]}
      />

      <OrbitControls minDistance={50} maxDistance={200} />

      <Suspense fallback={null}>
        <LeePerrySmith />
      </Suspense>
    </Canvas>
  );
}
