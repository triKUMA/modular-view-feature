import "./styles/Counter.css";

import { CSSProperties, useState } from "react";

interface CounterProps {
  style?: CSSProperties;
  key: string;
}

const Counter = (props: CounterProps) => {
  const [counter, setCounter] = useState(0);

  return (
    <div
      className="counter"
      onClick={() => setCounter(counter + 1)}
      style={props.style}
      key={props.key}
    >
      {counter}
    </div>
  );
};

export default Counter;
