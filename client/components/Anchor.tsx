import React, { useState } from "react";
import DominoesTile from "./DominoesTile";
import { AnchorProp } from "@/types";

function Anchor({ coordinates, tilt, tile, scale }: AnchorProp) {
  return (
    <div
      className="absolute w-fit"
      style={{
        left: `0%`,
        right: `0%`,
        transform: `translate(${coordinates[0]}px, ${coordinates[1]}px) rotate(${tilt}deg) scale(${scale}, ${scale})`,
        transition: "transform 300ms ease-in",
      }}
    >
      <DominoesTile tile={tile} />
    </div>
  );
}
export default Anchor;
