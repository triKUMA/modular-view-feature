import { DividerOrientation } from "../Divider/Divider";
import "./styles/DividerSlider.css";
import { BiRefresh } from "react-icons/bi";
import { useState } from "react";

interface DividerSliderProps {
  orientation: DividerOrientation;
  activateSlider: () => void;
  toggleOrientation: () => void;
}

const DividerSlider = (props: DividerSliderProps) => {
  const [mouseOver, setMouseOver] = useState(false);

  return (
    <div
      className="divider-slider"
      onMouseDown={(e) => {
        if ((e.target as HTMLElement).classList.contains("divider-slider")) {
          props.activateSlider();
        }
      }}
      style={{
        height: props.orientation === "horisontal" ? "100%" : undefined,
        width: props.orientation === "vertical" ? "100%" : undefined,
        cursor: props.orientation === "horisontal" ? "w-resize" : "n-resize",
      }}
      draggable={false}
      onMouseEnter={() => setMouseOver(true)}
      onMouseLeave={() => setMouseOver(false)}
    >
      {mouseOver && (
        <BiRefresh
          className="rotate-divider"
          onClick={(e) => {
            e.stopPropagation();
            props.toggleOrientation();
          }}
        />
      )}
    </div>
  );
};

export default DividerSlider;
