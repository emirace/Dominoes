import { usePreview } from "react-dnd-preview";
import DominoesTile from "./DominoesTile";
import { useSpring, animated, config } from "@react-spring/web";
import { useEffect, useState, useRef } from "react";

const TopZLayer = () => {
  let { display, item, style, ref } = usePreview();
  const [tile, setTile] = useState({});
  const [isDragging, setIsDragging] = useState(false);
  const [isReturning, setIsReturning] = useState(false);
  const [initialPosition, setInitialPosition] = useState("");

  useEffect(() => {
    if (display) {
      setIsDragging(true);
      setTile(item.tile);
      console.log(style);
      !initialPosition && setInitialPosition(style.transform);
    } else if (!display && isDragging) {
      setIsReturning(true);
      setIsDragging(false);
    }
  }, [display, initialPosition, isDragging]);

  // display && console.log(typeof style.transform, style.transform)
  const springProps = useSpring({
    transform: display
      ? style.transform
      : isReturning
      ? initialPosition
      : undefined,
    config: config.stiff,
    onRest: () => {
      console.log("resting");
      if (isReturning) {
        setIsReturning(false);
      }
    },
  });

  if (!display && !isReturning) return null;

  return (
    <animated.div
      ref={ref}
      style={{
        left: 0,
        pointerEvents: "none",
        position: "fixed",
        top: 0,
        transform: springProps.transform,
      }}
    >
      <DominoesTile tile={item?.tile || tile} />
    </animated.div>
  );
};

export default TopZLayer;
