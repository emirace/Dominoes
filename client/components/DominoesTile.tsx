import React, { useRef, useMemo } from "react";
import { DominoesTileProps } from "@/types";

function calcTilePosition(dots: [number, number]): [number, number] {
  if (dots[1] > dots[0] || dots.some((dot: number) => dot < 0 || dot > 6)) {
    return [4, 1];
  } else {
    const [top, bottom] = dots;
    const sum = (7 * (7 + 1)) / 2;
    const position = sum - ((top + 1) * (top + 2)) / 2 + top - bottom + 1;
    return [Math.ceil(position / 7) - 1, (position % 7 || 7) - 1];
  }
}

function DominoesTile({ tile: { tile }, size = "normal" }: DominoesTileProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const tilePosition = useMemo(() => calcTilePosition(tile), [tile]);

  return (
    <div
      ref={ref}
      className="tile transition-all rounded-md"
      style={{
        backgroundPosition: `-${80 * tilePosition[1]}px -${
          140 * tilePosition[0]
        }px`,
        transform: size === "small" ? "scale(0.5) translate(-50%, -50%)" : "",
      }}
    />
  );
}

export default DominoesTile;
