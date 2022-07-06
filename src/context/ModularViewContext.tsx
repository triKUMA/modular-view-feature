import React, { createContext, ReactNode, useEffect, useState } from "react";
import Divider, { DividerOrientation } from "../components/Divider/Divider";
import { v4 as uuidV4 } from "uuid";

// The base data model of the modular view.
interface View {
  id: string;
  orientation?: DividerOrientation;
  child1?: View | ReactNode;
  child2?: View | ReactNode;
}

interface AddChildDetails {
  child?: "1" | "2";
}

interface IModularViewContext {
  view: View;
  renderView: (
    view: View | ReactNode | undefined,
    parentOrientation?: DividerOrientation
  ) => ReactNode;
  addChild: (
    dividerID: string,
    element: ReactNode,
    details?: AddChildDetails
  ) => void;
}

export const ModularViewContext = createContext<IModularViewContext>({
  view: { id: "" },
  renderView: () => null,
  addChild: () => {},
});

interface ModularViewProps {
  children: ReactNode;
}

// A recursive function to search up an element's parent nodes to find a Divider element.
export const getDivider = (
  element: HTMLElement | null,
  previous?: HTMLElement
): { current: HTMLElement; child?: HTMLElement } | null => {
  if (element === null || element.className.includes("slider")) {
    return null;
  }

  return element.className.includes("divider")
    ? { current: element, child: previous }
    : getDivider(element.parentElement, element);
};

export const ModularViewProvider = (props: ModularViewProps) => {
  const [view, setView] = useState<View>({
    id: uuidV4(),
  });

  // A recursive function to search through the modular view data model and find a divider with a
  // matching id.
  const findDivider = (
    dividerID: string,
    view: View | ReactNode
  ): View | null => {
    if (!view || React.isValidElement(view)) {
      return null;
    }

    if ((view as View).id === dividerID) {
      return view as View;
    }

    const child1 = (view as View).child1;
    const child2 = (view as View).child2;

    return findDivider(dividerID, child1) || findDivider(dividerID, child2);
  };

  // Add a child element to a divider, creating a new split if necessary.
  const addChild = (
    dividerID: string,
    element: ReactNode,
    details?: AddChildDetails
  ): void => {
    const divider = findDivider(dividerID, view);

    if (!divider) return;

    if (!divider.child1) {
      divider.child1 = element;
    } else if (!divider.child2) {
      divider.child2 = element;
    } else {
      const child = details?.child || "2";

      if (child === "2") {
        divider.child2 = {
          id: uuidV4(),
          child1: divider.child2,
          child2: element,
        };
      } else {
        divider.child1 = {
          id: uuidV4(),
          child1: divider.child1,
          child2: element,
        };
      }
    }

    setView({ ...view });
  };

  // A recursive function to convert the modular view data model into elements.
  const renderView = (
    view: View | ReactNode | undefined,
    parentOrientation?: DividerOrientation
  ): ReactNode => {
    if (!view) {
      return null;
    }

    if (React.isValidElement(view)) {
      return view;
    }

    if (!(view as View).child1 && !(view as View).child2) {
      return <Divider id={(view as View).id} />;
    }

    return (
      <Divider
        child1={renderView(
          (view as View).child1,
          (view as View).orientation || parentOrientation === "horisontal"
            ? "vertical"
            : "horisontal"
        )}
        child2={renderView(
          (view as View).child2,
          (view as View).orientation || parentOrientation === "horisontal"
            ? "vertical"
            : "horisontal"
        )}
        parentOrientation={parentOrientation}
        id={(view as View).id}
      />
    );
  };

  // Set up each droppable element so they can accept a draggable item when it is dropped on them.
  const setUpDroppableElements = () => {
    const droppableItems = document.querySelectorAll(".droppable");

    droppableItems.forEach((droppable) => {
      (droppable as HTMLElement).ondragover = (e) => {
        e.preventDefault();
      };

      (droppable as HTMLElement).ondrop = (e) => {
        e.stopPropagation();

        const divider = getDivider(e.target as HTMLElement | null);

        if (divider) {
          addChild(
            divider.current.id,
            <div
              className="test"
              style={{
                backgroundColor: `rgb(
                                    ${Math.random() * 255},
                                    ${Math.random() * 255},
                                    ${Math.random() * 255}
                                  )`,
              }}
            />,
            {
              child: divider.child?.id.substring(
                divider.child?.id.length - 1
              ) as "1" | "2",
            }
          );
        }
      };
    });
  };

  // Re-set up all droppable elements, every time the view is changed.
  useEffect(() => {
    setUpDroppableElements();
  }, [view]);

  return (
    <ModularViewContext.Provider value={{ view, renderView, addChild }}>
      {props.children}
    </ModularViewContext.Provider>
  );
};

export default ModularViewProvider;
