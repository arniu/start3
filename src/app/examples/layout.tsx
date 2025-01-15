import type { Metadata } from "next";
import { Navbar } from "./navbar";

import "./common.css";

export const metadata: Metadata = {
  title: {
    template: "%s | React-Three examples",
    default: "React-Three examples",
  },
};

export default function ExamplesLayout({ children }: React.PropsWithChildren) {
  const panelWidth = 300;

  return (
    <>
      <Navbar width={panelWidth} />
      <div
        className="example"
        style={{
          paddingLeft: `${panelWidth}px`,
        }}
      >
        {children}
      </div>
    </>
  );
}
