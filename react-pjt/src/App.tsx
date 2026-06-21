import { useState } from "react";

export default function FilterableList() {
  const [count, setCount] = useState(0);

  const increase = () => {
    setCount(10);
    setCount((c) => c + 3);
  };

  return <div onClick={increase}>{count}</div>;
}
