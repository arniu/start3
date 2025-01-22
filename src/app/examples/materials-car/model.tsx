"use client";

import { LIB_DRACO } from "@/constants/r3f";
import { useEnvironment, useGLTF, useTexture } from "@react-three/drei";
import { ThreeElements, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useRef } from "react";
import * as THREE from "three";

const VENICE_SUNSET = "/examples/materials-car/venice_sunset_1k.hdr";
const FERRARI_AO = "/examples/materials-car/ferrari_ao.png";
const FERRARI = "/examples/materials-car/ferrari.glb";

export function Environment() {
  const scene = useThree((it) => it.scene);

  const rgbeTexture = useEnvironment({ files: VENICE_SUNSET });
  rgbeTexture.mapping = THREE.EquirectangularReflectionMapping;
  scene.environment = rgbeTexture;

  return null;
}

export function Grid(props: ThreeElements["gridHelper"]) {
  const grid = new THREE.GridHelper(20, 40, 0xffffff, 0xffffff);
  grid.material.opacity = 0.2;
  grid.material.depthWrite = false;
  grid.material.transparent = true;

  useFrame((state) => {
    grid.position.z = state.clock.elapsedTime % 1;
  });

  return <primitive {...props} object={grid} />;
}

type CarProps = ThreeElements["mesh"] & {
  bodyColor?: THREE.ColorRepresentation;
  glassColor?: THREE.ColorRepresentation;
  detailsColor?: THREE.ColorRepresentation;
};

export function Car({
  bodyColor,
  glassColor,
  detailsColor,
  ...props
}: CarProps) {
  const gltf = useGLTF(FERRARI, LIB_DRACO);
  const wheelsRef = useRef([] as THREE.Object3D[]);

  // FIXME: `gltf.scene.children[0]` can be `undefined` occasionally
  const model = gltf.nodes.RootNode ?? null;

  useFrame((state) => {
    const rotation = -state.clock.elapsedTime * Math.PI * 2;
    wheelsRef.current.forEach((wheel) => {
      wheel.rotation.x = rotation;
    });
  });

  useEffect(() => {
    wheelsRef.current = ["wheel_fl", "wheel_fr", "wheel_rl", "wheel_rr"]
      .map((name) => model?.getObjectByName(name))
      .filter((obj) => obj !== undefined);
  }, [model]);

  // set body material
  useEffect(() => {
    const material = new THREE.MeshPhysicalMaterial({
      color: bodyColor ?? 0xff0000,
      metalness: 1.0,
      roughness: 0.5,
      clearcoat: 1.0,
      clearcoatRoughness: 0.03,
    });

    attachTo(material, model, "body");
  }, [model, bodyColor]);

  // set glass material
  useEffect(() => {
    const material = new THREE.MeshPhysicalMaterial({
      color: glassColor ?? 0xffffff,
      metalness: 0.25,
      roughness: 0,
      transmission: 1.0,
    });

    attachTo(material, model, "glass");
  }, [model, glassColor]);

  // set details material
  useEffect(() => {
    const material = new THREE.MeshStandardMaterial({
      color: detailsColor ?? 0xffffff,
      metalness: 1.0,
      roughness: 0.5,
    });

    attachTo(material, model, "rim_fl", "rim_fr", "rim_rl", "rim_rr", "trim");
  }, [model, detailsColor]);

  return (
    <primitive {...props} object={model}>
      <Suspense fallback={null}>
        <Shadow renderOrder={2} />
      </Suspense>
    </primitive>
  );
}

function attachTo(
  material: THREE.Material,
  target?: THREE.Object3D,
  ...selectors: string[]
) {
  if (target) {
    selectors.forEach((name) => {
      const obj = target.getObjectByName(name);
      if (obj instanceof THREE.Mesh) {
        obj.material = material;
      }
    });
  }
}

function Shadow(props: ThreeElements["mesh"]) {
  const shadow = useTexture(FERRARI_AO);

  return (
    <mesh {...props} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[0.655 * 4, 1.3 * 4]} />
      <meshBasicMaterial
        blending={THREE.MultiplyBlending}
        toneMapped={false}
        transparent
        map={shadow}
      />
    </mesh>
  );
}
