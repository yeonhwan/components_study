import { forwardRef, cloneElement } from "react";

const Compose = forwardRef(({ children, ...props }, forwardRef) => {
  return cloneElement(children, { ...props, ref: forwardRef });
});

export default Compose;
