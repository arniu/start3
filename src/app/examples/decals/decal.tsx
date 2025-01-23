import {
  Decal,
  DecalProps,
  PerspectiveCamera,
  RenderTexture,
  Text,
  useTexture,
} from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Mesh } from "three";

type TextProps = {
  text: string;
};

export function TextDecal({ text, ...props }: DecalProps & TextProps) {
  const textRef = useRef<Mesh>(null!);

  useFrame((state) => {
    textRef.current.position.x = Math.sin(state.clock.elapsedTime) * 5.5;
  });

  return (
    <Decal {...props}>
      <meshStandardMaterial
        transparent
        roughness={1}
        polygonOffset
        polygonOffsetFactor={-1}
      >
        <RenderTexture attach="map">
          <color attach="background" args={["#af2040"]} />
          <directionalLight position={[10, 10, 5]} />
          <ambientLight intensity={Math.PI} />

          <PerspectiveCamera
            makeDefault
            manual
            aspect={0.9 / 0.25}
            position={[0, 0, 5]}
          />

          <Text
            ref={textRef}
            rotation={[0, Math.PI, 0]}
            fontSize={4}
            color="white"
          >
            {text}
          </Text>
        </RenderTexture>
      </meshStandardMaterial>
    </Decal>
  );
}

type ImageProps = {
  url: string;
};

export function ImageDecal({ url, ...props }: DecalProps & ImageProps) {
  const map = useTexture(url);

  return <Decal {...props} map={map} />;
}
