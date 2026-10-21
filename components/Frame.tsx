import type { ReactNode } from "react";
import Link from "next/link";

type ImageFrameProps = {
  index: string;
  label: string;
  caption: string;
  large?: boolean;
};

export function ImageFrame({ index, label, caption, large = false }: ImageFrameProps) {
  return (
    <figure className={large ? "frame frame-large" : "frame"}>
      <div className="frame-plate" aria-hidden="true">
        <span>{index}</span>
      </div>
      <figcaption>
        <span className="frame-label">{label}</span>
        {caption}
      </figcaption>
    </figure>
  );
}

export function Disclosure({ children }: { children: ReactNode }) {
  return <p className="disclosure">{children}</p>;
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return <p className="section-label">{children}</p>;
}
