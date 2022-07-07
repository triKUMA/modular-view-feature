import { CSSProperties, ReactElement } from "react";
import "./styles/DividerChild.css";

interface DividerChildProps {
  children: ReactElement;
  division: number;
  id: string;
}

const DividerChild = (props: DividerChildProps) => {
  return (
    <div
      className="divider-child droppable"
      style={{
        flex: props.division,
      }}
      id={props.id}
    >
      {props.children}
    </div>
  );
};

export default DividerChild;
