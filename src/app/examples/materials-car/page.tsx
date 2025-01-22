"use client";

import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import * as THREE from "three";

import { R3FLoading } from "@/components/loading";
import { Car, Environment, Grid } from "./model";

// https://threejs.org/examples/#webgl_materials_car
export default function Page() {
  const background = new THREE.Color(0x333333);
  const fog = new THREE.Fog(0x333333, 10, 15);

  return (
    <Canvas
      className="bg-[#333333]"
      scene={{ background, fog }}
      camera={{ fov: 75, near: 0.1, far: 1000, position: [4.25, 1.4, -4.5] }}
    >
      <OrbitControls
        maxDistance={9}
        maxPolarAngle={THREE.MathUtils.degToRad(90)}
        target={[0, 0.5, 0]}
      />

      <Suspense fallback={<R3FLoading />}>
        <Car />
        <Environment />
      </Suspense>

      <Grid />
    </Canvas>
  );
}
