import "./styles/Divider.css";
import { ReactElement, useContext, useEffect, useRef, useState } from "react";
import DividerChild from "../DividerChild/DividerChild";
import DividerSlider from "../Slider/DividerSlider";
import { ModularViewContext } from "../../context/ModularViewContext";

export type DividerOrientation = "horisontal" | "vertical";

export interface DividerProps {
  child1?: ReactElement | null;
  child2?: ReactElement | null;
  orientation: DividerOrientation;
  id: string;
}

const Divider = (props: DividerProps) => {
  const { rotateDivider } = useContext(ModularViewContext);

  const [division, setDivison] = useState(0.5);
  const [adjustDivision, setAdjustDivision] = useState(false);

  const divider = useRef<HTMLDivElement>(null);

  const calculateDivision = (
    e: MouseEvent | React.MouseEvent<HTMLDivElement, MouseEvent>
  ): number => {
    let newDivision = division;

    if (divider.current) {
      const dividerRect = divider.current.getBoundingClientRect();
      newDivision =
        props.orientation === "horisontal"
          ? (e.pageX - dividerRect.left) / dividerRect.width
          : (e.pageY - dividerRect.top) / dividerRect.height;
    }

    return newDivision;
  };

  useEffect(() => {
    document.addEventListener("mouseup", () => {
      setAdjustDivision(false);
    });
  }, []);

  return (
    <div
      className="divider droppable"
      style={{
        display: "flex",
        flexDirection: props.orientation === "horisontal" ? "row" : "column",
      }}
      ref={divider}
      onMouseMove={(e) => {
        if (adjustDivision) {
          setDivison(calculateDivision(e));
        }
      }}
      id={props.id}
    >
      {/* Child 1 */}
      {props.child1 && (
        <DividerChild
          division={props.child2 ? division : 1}
          id={props.id + "-1"}
        >
          {props.child1}
        </DividerChild>
      )}

      {/* Slider */}
      {props.child1 && props.child2 && (
        <DividerSlider
          orientation={props.orientation}
          activateSlider={() => setAdjustDivision(true)}
          toggleOrientation={() => rotateDivider(divider.current?.id || "")}
        />
      )}

      {/* Child 2 */}
      {props.child2 && (
        <DividerChild
          division={props.child1 ? 1 - division : 1}
          id={props.id + "-2"}
        >
          {props.child2}
        </DividerChild>
      )}
    </div>
  );
};

export default Divider;
