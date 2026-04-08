import { useState } from "react";

function useToggle(initialValue: boolean = false) {
  const [state, setState] = useState(initialValue);

  // 토글 로직을 내부에 캡슐화
  const toggle = () => setState((prev) => !prev);

  return [state, toggle] as const;
}

export default useToggle;