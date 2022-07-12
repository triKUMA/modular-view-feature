import { DividerOrientation } from "../Divider/Divider";
import "./styles/DividerSlider.css";
import { BiRefresh } from "react-icons/bi";
import { useEffect, useState } from "react";

interface DividerSliderProps {
  orientation: DividerOrientation;
  slider: { active: boolean; activate: () => void };
  toggleOrientation: () => void;
}

const DividerSlider = (props: DividerSliderProps) => {
  const [mouseOver, setMouseOver] = useState(false);

  useEffect(() => {
    if (props.slider.active) {
      document.body.style.cursor =
        props.orientation === "horisontal" ? "w-resize" : "n-resize";
    } else {
      document.body.style.cursor = "";
    }
  }, [props.slider.active]);

  return (
    <div
      className="divider-slider"
      onMouseDown={(e) => {
        if ((e.target as HTMLElement).classList.contains("divider-slider")) {
          props.slider.activate();
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
      {!props.slider.active && mouseOver && (
        <BiRefresh
          className="rotate-divider"
          onMouseDown={(e) => {
            e.stopPropagation();
          }}
          onClick={(e) => {
            e.stopPropagation();
            props.toggleOrientation();
          }}
          title="Rotate view"
        />
      )}
    </div>
  );
};

export default DividerSlider;
