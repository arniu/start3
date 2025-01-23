"use client";

import { ENV_FILE } from "@/constants/r3f";
import {
  AccumulativeShadows,
  Environment,
  OrbitControls,
  RandomizedLight,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { MathUtils } from "three";
import { Bunny, Dodecahedron } from "./model";

export default function Page() {
  return (
    <Canvas shadows camera={{ position: [-2.5, 1, 10], fov: 17 }}>
      <color attach="background" args={["#f0f0f0"]} />
      <ambientLight intensity={0.25 * Math.PI} />
      <spotLight position={[10, 10, 10]} decay={0} angle={0.15} penumbra={1} />
      <pointLight position={[-10, 0, -5]} decay={0} intensity={6} />
      <axesHelper args={[3]} />

      <OrbitControls makeDefault maxPolarAngle={MathUtils.degToRad(90)} />

      <Suspense fallback={null}>
        <Environment files={ENV_FILE.dancing_hall_1k} background blur={1} />

        <group position={[0, -0.75, 0]}>
          <Bunny />

          <Dodecahedron scale={0.1} position={[-0.9, 2, 0.4]} />

          <AccumulativeShadows
            color="black"
            frames={80}
            opacity={1}
            scale={12}
            position={[0, 0.04, 0]}
          >
            <RandomizedLight
              amount={8}
              radius={5}
              ambient={0.5}
              position={[5, 6, -10]}
              bias={0.001}
            />
          </AccumulativeShadows>
        </group>
      </Suspense>
    </Canvas>
  );
}
