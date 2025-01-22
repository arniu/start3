import { Html, useProgress } from "@react-three/drei";

export function R3FLoading() {
  const { progress, item } = useProgress();

  return (
    <Html center>
      <h2>{item}</h2>
      <p>{progress} % loaded</p>
    </Html>
  );
}
