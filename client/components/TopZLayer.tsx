import { usePreview } from "react-dnd-preview";
import DominoesTile from "./DominoesTile";

const TopZLayer = () => {
  const { display, item, style } = usePreview();
  if (!display) return;
  return (
    <div style={style}>
      <DominoesTile tile={item.tile} />
    </div>
  );
};

export default TopZLayer;
