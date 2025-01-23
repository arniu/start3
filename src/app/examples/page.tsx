"use client";

import { useRouter } from "next/navigation";
import { examples } from "./navbar";

export default function Page() {
  const router = useRouter();
  const firstOne = examples[0];
  if (firstOne) {
    router.replace(firstOne.href);
  }

  return null;
}
