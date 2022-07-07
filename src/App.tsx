import { useContext } from "react";
import "./App.css";
import { ModularViewContext } from "./context/ModularViewContext";

function App() {
  const { view, renderView } = useContext(ModularViewContext);

  return (
    <div className="App">
      <div className="sidebar">
        <div className="drag-item" draggable>
          Drag Me!
        </div>
      </div>

      {renderView(view)}
    </div>
  );
}

export default App;
