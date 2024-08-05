import React, { useState, useEffect } from "react";
import { usePreview, usePreviewState } from "react-dnd-preview";
import html2canvas from "html2canvas";
import DominoesTile from "./DominoesTile";
import { createRoot } from "react-dom/client";
import { numberPair } from "@/types";


const TopZLayer = () => {
  const { display, item, style } = usePreview();

  if (!display) {
    return null;
  }

  style.top = -30;
  style.left = -5;
  return (
    <div style={style}>
      <DominoesTile
        config={{
          dots: item.tile,
          active: false,
          scale: 1,
          tilt: 0,
        }}
      />
    </div>
  );
};

export default TopZLayer;
