import "./styles/Divider.css";
import { ReactNode, useEffect, useRef, useState } from "react";

export type DividerOrientation = "horisontal" | "vertical";

export interface DividerProps {
  child1?: ReactNode;
  child2?: ReactNode;
  parentOrientation?: DividerOrientation;
  id: string;
}

const Divider = (props: DividerProps) => {
  const getOrientation = (): DividerOrientation => {
    if (!props.parentOrientation) {
      return "horisontal";
    }

    return props.parentOrientation === "horisontal" ? "vertical" : "horisontal";
  };

  const divider = useRef<HTMLDivElement>(null);
  const [orientation, setOrientation] = useState<"horisontal" | "vertical">(
    getOrientation()
  );
  const [division, setDivison] = useState(0.5);
  const [adjustDivision, setAdjustDivision] = useState(false);

  const calculateDivision = (
    e: MouseEvent | React.MouseEvent<HTMLDivElement, MouseEvent>
  ): number => {
    let newDivision = division;

    if (divider.current) {
      const dividerRect = divider.current.getBoundingClientRect();
      newDivision =
        orientation === "horisontal"
          ? (e.pageX - dividerRect.left) / dividerRect.width
          : (e.pageY - dividerRect.top) / dividerRect.height;
    }

    return newDivision;
  };

  useEffect(() => {
    setOrientation(getOrientation()); // eslint-disable-next-line
  }, [props.parentOrientation]);

  return (
    <div
      className="divider droppable"
      style={{
        display: "flex",
        flexDirection: orientation === "horisontal" ? "row" : "column",
      }}
      ref={divider}
      onMouseMove={(e) => {
        if (adjustDivision) {
          setDivison(calculateDivision(e));
        }
      }}
      onMouseUp={() => {
        setAdjustDivision(false);
      }}
      onMouseLeave={() => {
        setAdjustDivision(false);
      }}
      id={props.id}
    >
      {/* Child 1 */}
      {props.child1 && (
        <div
          className="child droppable"
          style={{
            flex: props.child2 ? division : 1,
          }}
          id={props.id + "-1"}
        >
          {props.child1}
        </div>
      )}

      {/* Slider */}
      {props.child1 && props.child2 && (
        <div
          className="slider"
          style={{
            height: orientation === "horisontal" ? "100%" : undefined,
            width: orientation === "vertical" ? "100%" : undefined,
          }}
          onMouseDown={() => setAdjustDivision(true)}
          draggable={false}
        />
      )}

      {/* Child 2 */}
      {props.child2 && (
        <div
          className="child droppable"
          style={{
            flex: props.child1 ? 1 - division : 1,
          }}
          id={props.id + "-2"}
        >
          {props.child2}
        </div>
      )}
    </div>
  );
};

export default Divider;
