"use client";

import { useEnvironment, useGLTF } from "@react-three/drei";
import { useFrame, useLoader, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useRef } from "react";
import * as THREE from "three";

const DRACO_GLTF = "/libs/draco-gltf/";
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

export function Grid(props: JSX.IntrinsicElements["gridHelper"]) {
  const grid = new THREE.GridHelper(20, 40, 0xffffff, 0xffffff);
  grid.material.opacity = 0.2;
  grid.material.depthWrite = false;
  grid.material.transparent = true;

  useFrame((state) => {
    grid.position.z = state.clock.elapsedTime % 1;
  });

  return <primitive {...props} object={grid} />;
}

type CarProps = JSX.IntrinsicElements["mesh"] & {
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
  const gltf = useGLTF(FERRARI, DRACO_GLTF);
  const wheelsRef = useRef([] as THREE.Object3D[]);

  // FIXME: `gltf.scene.children[0]` can be `undefined` occasionally
  const carModel = gltf.nodes["RootNode"] ?? null;

  useFrame((state) => {
    const rotation = -state.clock.elapsedTime * Math.PI * 2;
    wheelsRef.current.forEach((wheel) => {
      wheel.rotation.x = rotation;
    });
  });

  useEffect(() => {
    wheelsRef.current = ["wheel_fl", "wheel_fr", "wheel_rl", "wheel_rr"]
      .map((name) => carModel?.getObjectByName(name))
      .filter((obj) => obj !== undefined);
  }, [carModel]);

  // set body material
  useEffect(() => {
    const material = new THREE.MeshPhysicalMaterial({
      color: bodyColor ?? 0xff0000,
      metalness: 1.0,
      roughness: 0.5,
      clearcoat: 1.0,
      clearcoatRoughness: 0.03,
    });

    setMaterial.call(carModel, material, "body");
  }, [carModel, bodyColor]);

  // set glass material
  useEffect(() => {
    const material = new THREE.MeshPhysicalMaterial({
      color: glassColor ?? 0xffffff,
      metalness: 0.25,
      roughness: 0,
      transmission: 1.0,
    });

    setMaterial.call(carModel, material, "glass");
  }, [carModel, glassColor]);

  // set details material
  useEffect(() => {
    const material = new THREE.MeshStandardMaterial({
      color: detailsColor ?? 0xffffff,
      metalness: 1.0,
      roughness: 0.5,
    });

    // prettier-ignore
    setMaterial.call(carModel, material, "rim_fl", "rim_fr", "rim_rl", "rim_rr", "trim");
  }, [carModel, detailsColor]);

  return (
    carModel && (
      <primitive {...props} object={carModel}>
        <Suspense fallback={null}>
          <Shadow renderOrder={2} />
        </Suspense>
      </primitive>
    )
  );
}

function setMaterial(
  this: THREE.Object3D | undefined,
  material: THREE.Material,
  ...names: string[]
) {
  if (this) {
    names.forEach((name) => {
      const obj = this.getObjectByName(name);
      if (obj instanceof THREE.Mesh) {
        obj.material = material;
      }
    });
  }
}

function Shadow(props: JSX.IntrinsicElements["mesh"]) {
  const shadow = useLoader(THREE.TextureLoader, FERRARI_AO);

  return (
    <mesh {...props} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[0.655 * 4, 1.3 * 4]} />
      <meshBasicMaterial
        map={shadow}
        blending={THREE.MultiplyBlending}
        toneMapped={false}
        transparent
      />
    </mesh>
  );
}
