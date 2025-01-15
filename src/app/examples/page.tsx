"use client";

import { useRouter } from "next/navigation";
import { NAV_LIST } from "./navbar";

export default function Page() {
  const router = useRouter();
  const firstOne = NAV_LIST[0];
  if (firstOne) {
    router.replace(firstOne.href);
  }

  return null;
}
