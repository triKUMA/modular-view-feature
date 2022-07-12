import { ReactElement, useState, useEffect, useContext } from "react";
import "./styles/DividerChild.css";
import { TiDelete } from "react-icons/ti";
import Divider from "../Divider/Divider";
import { ModularViewContext } from "../../context/ModularViewContext";

interface DividerChildProps {
  children: ReactElement;
  division: { value: number; active: boolean };
  id: string;
}

const DividerChild = (props: DividerChildProps) => {
  const { removeChild } = useContext(ModularViewContext);

  const [isEndNode, setIsEndNode] = useState(props.children.type !== Divider);
  const [displayActions, setDisplayActions] = useState(false);

  useEffect(() => {
    setIsEndNode(props.children.type !== Divider);
  }, [props.children]);

  return (
    <div
      className="divider-child droppable"
      style={{
        flex: props.division.value,
      }}
      id={props.id}
      onMouseEnter={(e) => {
        setDisplayActions(true && isEndNode);
      }}
      onMouseLeave={(e) => {
        setDisplayActions(false);
      }}
    >
      {props.children}

      {displayActions && !props.division.active && (
        <div className="actions-wrapper">
          <TiDelete
            onClick={(e) => {
              removeChild(e.target as HTMLElement);
            }}
            title="Remove element"
          />
        </div>
      )}
    </div>
  );
};

export default DividerChild;
