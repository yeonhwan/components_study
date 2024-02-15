import {
  useFloating,
  autoUpdate,
  offset,
  hide,
  autoPlacement,
} from "@floating-ui/react";
import React, {
  type ReactElement,
  forwardRef,
  HTMLAttributes,
  CSSProperties,
} from "react";
import Portal from "../utils/Portal";
import Presence from "../utils/Presence";

type PopperProps = {
  children: ReactElement;
  anchor: HTMLElement | null;
  state: boolean;
};

export const Popper = ({ anchor, state, ...props }: PopperProps) => {
  const { floatingStyles, refs, isPositioned } = useFloating({
    strategy: "fixed",
    open: state,
    elements: {
      reference: anchor,
    },
    middleware: [
      offset(-5),
      autoPlacement({
        allowedPlacements: ["bottom", "top"],
        padding: 5,
      }),
      hide(),
    ],
    whileElementsMounted: autoUpdate,
  });

  return (
    <Presence {...props} present={state}>
      <Portal>
        <PopperWrapper
          isPositioned={isPositioned}
          setAnchor={refs.setFloating}
          floatingStyles={floatingStyles}
          state={state}
          {...props}
        />
      </Portal>
    </Presence>
  );
};

type PopperWrapperProps = {
  children: ReactElement;
  isPositioned: boolean;
  state: boolean;
  floatingStyles: CSSProperties;
  setAnchor: (node: HTMLElement | null) => void;
} & HTMLAttributes<HTMLDivElement>;

const PopperWrapper = forwardRef<HTMLDivElement, PopperWrapperProps>(
  (
    { children, floatingStyles, isPositioned, state, setAnchor, ...props },
    forwardRef
  ) => {
    const hide = state ? isPositioned : true;

    return (
      <div
        ref={setAnchor}
        className="popper__wrapper"
        style={{
          ...floatingStyles,
          transform: hide ? floatingStyles.transform : "translateY(-999%)",
        }}
      >
        {React.cloneElement(children, {
          ...props,
          ref: forwardRef,
        })}
      </div>
    );
  }
);
PopperWrapper.displayName = "PopperWrapper";
