import React from "react";
import { createPortal } from "react-dom";

type PortalProps = {
  children: React.ReactElement;
};

const Portal = React.forwardRef<HTMLDivElement, PortalProps>(
  ({ children, ...props }: PortalProps, forwardRef) => {
    const Element = React.cloneElement(children, { ...props, ref: forwardRef });

    return createPortal(Element, document.body);
  }
);

Portal.displayName = "Portal";

export default Portal;
