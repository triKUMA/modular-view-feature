import { CSSProperties } from "react";
import { DividerOrientation } from "../Divider/Divider";
import "./styles/DividerSlider.css";

interface DividerSliderProps {
  orientation: DividerOrientation;
  activateSlider: () => void;
}

const DividerSlider = (props: DividerSliderProps) => {
  return (
    <div
      className="divider-slider"
      onMouseDown={props.activateSlider}
      style={{
        height: props.orientation === "horisontal" ? "100%" : undefined,
        width: props.orientation === "vertical" ? "100%" : undefined,
        cursor: props.orientation === "horisontal" ? "w-resize" : "n-resize",
      }}
      draggable={false}
    ></div>
  );
};

export default DividerSlider;
