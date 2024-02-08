import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  hide,
} from "@floating-ui/react";
import React, { type ReactElement, forwardRef } from "react";
import Portal from "../utils/Portal";
import Presence from "../utils/Presence";

type PopperProps = {
  anchor: HTMLElement;
  state: boolean;
  children: ReactElement;
};

export const Popper = ({
  anchor,
  state,
  ...props
}: { children: React.FC } & PopperProps) => {
  const { floatingStyles, refs, isPositioned } = useFloating({
    strategy: "fixed",
    open: state,
    elements: {
      reference: anchor,
    },
    middleware: [offset(-5), flip(), hide()],
    whileElementsMounted: autoUpdate,
  });

  return (
    <Presence {...props} present={state}>
      <Portal>
        <PopperWrapper
          isPositioned={isPositioned}
          ref={refs.setFloating}
          style={floatingStyles}
          state={state}
          {...props}
        />
      </Portal>
    </Presence>
  );
};

const PopperWrapper = forwardRef<HTMLDivElement, PopperProps>(
  (
    { children, style, isPositioned, state, refCallback, ...props },
    forwardRef
  ) => {
    const Element = React.cloneElement(children, {
      ...props,
      ref: refCallback,
    });
    const floatingStyles = style;

    const hide = state ? isPositioned : true;

    return (
      <div
        id="popper__wrapper"
        ref={forwardRef}
        className="popper__wrapper"
        style={{
          ...floatingStyles,
          transform: hide ? floatingStyles.transform : "translateY(-999%)",
        }}
      >
        {Element}
      </div>
    );
  }
);
PopperWrapper.displayName = "PopperWrapper";
