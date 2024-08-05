import React, { useState } from "react";
import DominoesTile from "./DominoesTile";
import { AnchorProp } from "@/types";

function Anchor({ coordinates, finalCoordinates, tilt, tile }: AnchorProp) {

  const something = finalCoordinates || coordinates
  return (
    <div
      className="absolute"
      style={{
        left: `${0}%`,
        right: `${0}%`,
        transform: `translate(${something[0] - 30}px, ${something[1] - 60}px)`,
        transition: "transform 200ms ease-in",
      }}
    >
      <DominoesTile
        config={{ dots: tile, active: false, scale: 1, tilt: tilt }}
      />
    </div>
  );
}
export default Anchor;
