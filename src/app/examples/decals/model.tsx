"use client";

import { useGLTF } from "@react-three/drei";
import { ThreeEvent, useLoader } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { DecalGeometry } from "three/examples/jsm/Addons.js";

const DRACO_GLTF = "/libs/draco-gltf/";

type DecalData = {
  position: THREE.Vector3;
  orientation: THREE.Euler;
  color: THREE.Color;
  size: THREE.Vector3;
};

const params = {
  minScale: 10, // [1, 30]
  maxScale: 20, // [1, 30]
  rotate: true,
};

export function LeePerrySmith(props: JSX.IntrinsicElements["mesh"]) {
  const model = useLeePerrySmith();
  const decalMaterial = useDecalMaterial();
  const meshRef = useRef<THREE.Mesh>(null!);
  const [decals, setDecals] = useState<DecalData[]>([]);

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();

    const normalMatrix = new THREE.Matrix3().getNormalMatrix(model.matrixWorld);

    const inters0 = e.intersections[0];
    if (inters0) {
      const n = inters0.face?.normal ?? new THREE.Vector3();
      n.applyNormalMatrix(normalMatrix);
      n.multiplyScalar(10);
      n.add(inters0.point);
      meshRef.current.lookAt(n);

      const orientation = meshRef.current.rotation.clone();
      if (params.rotate) {
        orientation.z = Math.random() * 2 * Math.PI;
      }

      const position = inters0.point;
      const color = new THREE.Color(Math.random() * 0xffffff);
      const size = new THREE.Vector3().setScalar(
        params.minScale + Math.random() * (params.maxScale - params.minScale),
      );

      setDecals([
        ...decals,
        {
          position,
          orientation,
          color,
          size,
        },
      ]);
    }
  };

  return (
    <>
      <group onClick={handleClick}>
        <primitive {...props} object={model} />
      </group>

      <mesh ref={meshRef} visible={false}>
        <boxGeometry args={[1, 1, 10]} />
        <meshNormalMaterial />
      </mesh>

      {decals.map((decal, idx) => {
        const material = decalMaterial.clone();
        material.color = decal.color;
        const geometry = new DecalGeometry(
          model,
          decal.position,
          decal.orientation,
          decal.size,
        );

        return (
          <mesh
            key={idx}
            geometry={geometry}
            material={material}
            renderOrder={idx}
          />
        );
      })}
    </>
  );
}

export function useLeePerrySmith() {
  const LEE_PERRY_SMITH = "/examples/decals/LeePerrySmith/LeePerrySmith.glb";
  const { nodes } = useGLTF(LEE_PERRY_SMITH, DRACO_GLTF);

  const [normalMap, specularMap, map] = useLoader(THREE.TextureLoader, [
    "/examples/decals/LeePerrySmith/Infinite-Level_02_Tangent_SmoothUV.jpg",
    "/examples/decals/LeePerrySmith/Map-SPEC.jpg",
    "/examples/decals/LeePerrySmith/Map-COL.jpg",
  ]);

  return useMemo(() => {
    const model = nodes.LeePerrySmith as THREE.Mesh;
    if (model.scale.x < 10) {
      model.scale.multiplyScalar(10);
    }

    map.colorSpace = THREE.SRGBColorSpace;
    model.material = new THREE.MeshPhongMaterial({
      specular: 0x111111,
      shininess: 25,
      specularMap,
      normalMap,
      map,
    });

    return model;
  }, [map, nodes, normalMap, specularMap]);
}

export function useDecalMaterial() {
  const [decalDiffuse, decalNormal] = useLoader(THREE.TextureLoader, [
    "/examples/decals/decal/decal-diffuse.png",
    "/examples/decals/decal/decal-normal.jpg",
  ]);

  return useMemo(
    () =>
      new THREE.MeshPhongMaterial({
        specular: 0x444444,
        map: decalDiffuse,
        normalMap: decalNormal,
        normalScale: new THREE.Vector2(1, 1),
        shininess: 30,
        transparent: true,
        depthTest: true,
        depthWrite: false,
        polygonOffset: true,
        polygonOffsetFactor: -4,
        wireframe: false,
      }),
    [decalDiffuse, decalNormal],
  );
}
