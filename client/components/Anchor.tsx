import React, { useState } from "react";
import DominoesTile from "./DominoesTile";
import DropZone from "./DropZone";
import { useSpring, animated, config } from "@react-spring/web";
import { AnchorProp } from "@/types";

function Anchor({
  coordinates,
  tilt,
  tile,
  scale,
  initailSetAnchor,
  activeHover,
}: AnchorProp) {
  const springProp = useSpring({
    top: coordinates[1],
    left: coordinates[0],
    transform: `scale(${scale}) rotate(${tilt})`,
    config: config.stiff,
  });

  return (
    <animated.div
      className="absolute w-fit top"
      style={springProp}
    >
      <DominoesTile tile={tile} />
      <div className="  absolute  top-1/2 left-1/2">
        <DropZone
          acceptedDotCount={tile.tile}
          position={null}
          id={tile.id}
          {...{ activeHover, initailSetAnchor, scale }}
        />
      </div>
    </animated.div>
  );
}
export default Anchor;
