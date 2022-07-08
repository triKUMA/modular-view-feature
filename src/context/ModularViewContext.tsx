import React, { createContext, ReactElement, useEffect, useState } from "react";
import Divider, { DividerOrientation } from "../components/Divider/Divider";
import { v4 as uuidV4 } from "uuid";
import Counter from "../components/Counter/Counter";
import { useImmer } from "use-immer";

// The base data model of the modular view.
interface View {
  id: string;
  orientation?: DividerOrientation;
  child1?: View | ReactElement;
  child2?: View | ReactElement;
}

interface AddChildDetails {
  child?: "1" | "2";
}

interface IModularViewContext {
  view: View;
  renderView: (
    view: View | ReactElement | undefined,
    parentOrientation?: DividerOrientation
  ) => ReactElement | null;
  addChild: (
    view: View,
    dividerID: string,
    element: ReactElement,
    details?: AddChildDetails
  ) => void;
  removeChild: (element: HTMLElement) => void;
}

export const ModularViewContext = createContext<IModularViewContext>({
  view: { id: "" },
  renderView: () => null,
  addChild: () => {},
  removeChild: () => {},
});

interface ModularViewProps {
  children: ReactElement;
}

// A recursive function to search up an element's parent nodes to find a Divider element.
export const getDivider = (
  element: HTMLElement | null,
  previous?: HTMLElement
): { current: HTMLElement; child?: HTMLElement } | null => {
  if (element === null || element.classList.contains("divider-slider")) {
    return null;
  }

  return element.classList.contains("divider")
    ? { current: element, child: previous }
    : getDivider(element.parentElement, element);
};

export const ModularViewProvider = (props: ModularViewProps) => {
  const [view, setView] = useImmer<View>({
    id: uuidV4(),
  });

  // A recursive function to search through the modular view data model and find a divider with a
  // matching id.
  const findDivider = (
    dividerID: string,
    view: View | ReactElement | undefined
  ): View | null => {
    if (!view || React.isValidElement(view)) {
      return null;
    }

    if ((view as View).id === dividerID) {
      return view as View;
    }

    return (
      findDivider(dividerID, (view as View).child1) ||
      findDivider(dividerID, (view as View).child2)
    );
  };

  // Add a child element to a divider, creating a new split if necessary.
  const addChild = (
    view: View,
    dividerID: string,
    element: ReactElement,
    details?: AddChildDetails
  ): void => {
    const divider = findDivider(dividerID, view);

    if (!divider) return;

    if (!divider.child1) {
      // Place element in empty child1 slot.
      divider.child1 = element;
    } else if (!divider.child2) {
      // Place element in empty child2 slot.
      divider.child2 = element;
    } else {
      // Both child1 and child2 are occupied, place the hovered child inside a new divider, and place
      // the element inside the new divider's other child slot.
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
  };

  const cleanseView = (view: View) => {
    let modifiedSelf = false;

    if (view.child1 && !React.isValidElement(view.child1)) {
      const subView = view.child1;
      if (!subView.child1 && !subView.child2) {
        view.child1 = undefined;
        modifiedSelf = true;
      } else if (subView.child1 && !subView.child2) {
        view.child1 = subView.child1;
        modifiedSelf = true;
      } else if (subView.child2 && !subView.child1) {
        view.child1 = subView.child2;
        modifiedSelf = true;
      } else if (!view.child2 && subView.child1 && subView.child2) {
        view.child1 = subView.child1;
        view.child2 = subView.child2;
        modifiedSelf = true;
      }
    }

    if (view.child2 && !React.isValidElement(view.child2)) {
      const subView = view.child2;
      if (!subView.child1 && !subView.child2) {
        view.child2 = undefined;
        modifiedSelf = true;
      } else if (subView.child1 && !subView.child2) {
        view.child2 = subView.child1;
        modifiedSelf = true;
      } else if (subView.child2 && !subView.child1) {
        view.child2 = subView.child2;
        modifiedSelf = true;
      } else if (!view.child1 && subView.child1 && subView.child2) {
        view.child1 = subView.child1;
        view.child2 = subView.child2;
        modifiedSelf = true;
      }
    }

    if (modifiedSelf) {
      cleanseView(view);
    } else {
      if (view.child1 && !React.isValidElement(view.child1))
        cleanseView(view.child1);
      if (view.child2 && !React.isValidElement(view.child2))
        cleanseView(view.child2);
    }
  };

  const removeChild = (element: HTMLElement) => {
    const divider = getDivider(element);

    if (divider) {
      setView((view) => {
        let dividerData = findDivider(divider.current.id, view);

        if (dividerData) {
          const child = divider.child?.id.substring(
            divider.child?.id.length - 1
          ) as "1" | "2" | undefined;

          switch (child) {
            case "1":
              dividerData.child1 = undefined;
              break;

            case "2":
              dividerData.child2 = undefined;

              break;
          }
        }
      });

      setView((view) => {
        cleanseView(view);
      });
    }
  };

  // A recursive function to convert the modular view data model into elements.
  const renderView = (
    view: View | ReactElement | undefined,
    parentOrientation?: DividerOrientation
  ): ReactElement | null => {
    if (!view) {
      return null;
    }

    if (React.isValidElement(view)) {
      return view;
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
      // Prevent dragover event default to allow 'ondrop' event to run.
      (droppable as HTMLElement).ondragover = (e) => {
        e.preventDefault();
      };

      (droppable as HTMLElement).ondrop = (e) => {
        e.stopPropagation();

        const divider = getDivider(e.target as HTMLElement | null);

        if (divider) {
          const bgColour = {
            r: Math.random() * 255,
            g: Math.random() * 255,
            b: Math.random() * 255,
          };

          // Calculate best contrast foreground colour using YIQ method.
          const fgColour =
            (bgColour.r * 299 + bgColour.g * 587 + bgColour.b * 114) / 1000 >=
            128
              ? { r: 0, b: 0, g: 0 }
              : { r: 255, b: 255, g: 255 };

          // Currently only a set element is added into the view (this will be changed later).
          setView((view) => {
            addChild(
              view,
              divider.current.id,
              <Counter
                style={{
                  backgroundColor: `rgb(${bgColour.r}, ${bgColour.g}, ${bgColour.b})`,
                  color: `rgb(${fgColour.r}, ${fgColour.g}, ${fgColour.b})`,
                }}
                key={uuidV4()}
              />,
              {
                child: divider.child?.id.substring(
                  divider.child?.id.length - 1
                ) as "1" | "2" | undefined,
              }
            );
          });
        }
      };
    });
  };

  // Re-set up all droppable elements, every time the view is changed.
  useEffect(() => {
    setUpDroppableElements();
  }, [view]);

  return (
    <ModularViewContext.Provider
      value={{ view, renderView, addChild, removeChild }}
    >
      {props.children}
    </ModularViewContext.Provider>
  );
};

export default ModularViewProvider;
