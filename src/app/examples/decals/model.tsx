import { LIB_DRACO } from "@/constants/r3f";
import { useCursor, useGLTF } from "@react-three/drei";
import { ThreeElements, useFrame } from "@react-three/fiber";
import { useControls } from "leva";
import { useRef, useState } from "react";
import { Mesh } from "three";
import { ImageDecal, TextDecal } from "./decal";

const BUNNY = "/examples/decals/bunny.glb";
const REACT = "/examples/decals/react.png";

export function Bunny(props: ThreeElements["mesh"]) {
  const { nodes } = useGLTF(BUNNY, LIB_DRACO);
  const bunny = nodes.bunny as Mesh;

  const position = useControls("position", {
    x: { value: 0, min: -5, max: +5, step: 0.01 },
    y: { value: 1.33, min: -5, max: +5, step: 0.01 },
    z: { value: 0.23, min: -5, max: +5, step: 0.01 },
  });

  const rotation = useControls("rotation", {
    x: { value: 1.5, min: 0, max: Math.PI * 2, step: 0.01 },
    y: { value: 0, min: 0, max: Math.PI * 2, step: 0.01 },
    z: { value: 0, min: 0, max: Math.PI * 2, step: 0.01 },
  });

  return (
    <mesh
      {...props}
      castShadow
      receiveShadow
      geometry={bunny.geometry}
      dispose={null}
    >
      <meshStandardMaterial
        color="black"
        roughness={0.3}
        transparent
        opacity={0.3}
        depthTest={false}
      />

      <TextDecal
        text="Hello from Drei"
        position={[0, 0.9, 0.75]}
        rotation={[-0.4, Math.PI, 0]}
        scale={[0.9, 0.25, 1]}
      />

      <ImageDecal
        url={REACT}
        polygonOffsetFactor={0}
        position={[position.x, position.y, position.z]}
        rotation={[rotation.x, rotation.y, rotation.z]}
        scale={0.3}
        debug
      />
    </mesh>
  );
}

export function Dodecahedron(props: ThreeElements["group"]) {
  const meshRef = useRef<Mesh>(null!);
  const [hovered, hover] = useState(false);
  const [clicked, click] = useState(false);

  useCursor(hovered);
  useFrame((_state, delta) => {
    meshRef.current.rotation.x = meshRef.current.rotation.y += delta;
  });

  return (
    <group {...props}>
      <mesh
        ref={meshRef}
        scale={clicked ? 2.25 : 1.75}
        onClick={() => click(!clicked)}
        onPointerOver={() => hover(true)}
        onPointerOut={() => hover(false)}
      >
        <dodecahedronGeometry args={[0.75]} />
        <meshStandardMaterial color={hovered ? "hotpink" : "goldenrod"} />

        <ImageDecal
          url={REACT}
          polygonOffsetFactor={0}
          position={[0, -0.2, 0.5]}
          scale={0.75}
        />
      </mesh>
    </group>
  );
}
