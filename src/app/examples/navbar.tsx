"use client";

import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const NAV_LIST = [
  { name: "decals", label: "Load geometry" },
  { name: "materials-car", label: "Load materials" },
  { name: "render-texture", label: "Render texture", cover: "cover.png" },
].map(({ cover = "cover.jpg", ...example }) => ({
  href: `/examples/${example.name}`,
  cover: `/examples/${example.name}/${cover}`,
  ...example,
}));

interface NavbarProps {
  width: number;
}

export function Navbar({ width }: NavbarProps) {
  const pathname = usePathname();

  return (
    <nav
      className="fixed left-0 z-50 h-full overflow-auto p-[16px]"
      style={{
        width: `${width}px`,
        borderRight: "1px solid #7773",
      }}
    >
      <h2 className="select-none text-xl font-bold">
        Three.<span className="text-sm text-yellow-300">JS</span> Examples
      </h2>
      <ol>
        {NAV_LIST.map((example, idx) => (
          <li
            key={example.name + idx}
            className={clsx("mt-[16px] block overflow-hidden rounded-md", {
              "ring ring-blue-500": example.href === pathname,
            })}
          >
            <Link href={example.href}>
              <Image
                src={example.cover}
                alt={example.name}
                width={400}
                height={250}
              />
              <p className="p-[8px]">{example.label}</p>
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}
