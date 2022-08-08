import { useState, useRef } from "react";

export const useToggle = (initialState = false) => {
  const [state, setState] = useState(initialState);
  
  const toggle = useRef(() => setState(state => !state));
  
  return [state, toggle.current]
}
