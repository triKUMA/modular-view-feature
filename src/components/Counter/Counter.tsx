import "./styles/Counter.css";

import { CSSProperties, useState } from "react";

interface CounterProps {
  style?: CSSProperties;
}

const Counter = (props: CounterProps) => {
  const [counter, setCounter] = useState(0);

  return (
    <div
      className="counter"
      onClick={() => setCounter(counter + 1)}
      style={props.style}
    >
      {counter}
    </div>
  );
};

export default Counter;
