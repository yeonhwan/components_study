import React from "react";
import Compose from "./Compose";

type SlotProps = {
  asChild: boolean;
  children: React.ReactElement;
};

/**
 * ^ Act as Slot for Compose
 * ^ Recieve: props & forwardRef + children
 *
 * forwarding to compose (props, ref, children)
 */
const Slot = React.forwardRef<HTMLElement, SlotProps>((props, forwardRef) => {
  const { children, ...rest } = props;

  return (
    <Compose {...rest} ref={forwardRef}>
      {children}
    </Compose>
  );
});

export default Slot;
