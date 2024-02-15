import { forwardRef, useEffect, useRef, useState } from "react";
import { composeRef } from "../../hooks/composeRef";
import Compose from "../primitives/Compose";

type DismissableProps = {
  onLoseFocus: () => void;
} & React.HTMLAttributes<HTMLElement>;

const Dismissable = forwardRef<unknown, DismissableProps>(
  ({ onLoseFocus, ...props }, forwardRef) => {
    const [node, setNode] = useState<HTMLElement | null>(null);
    const prevFocused = useRef(false);

    const autoFocus = (element: HTMLElement) => {
      if (element && !prevFocused.current) {
        element.focus();
        document.body.style.pointerEvents = "none";
        prevFocused.current = true;
      }
    };

    const refControl = (node: HTMLElement) => {
      if (node) {
        setNode(node);
      }
    };
    const composedRef = composeRef(forwardRef, refControl, autoFocus);

    // controlling focus
    useEffect(() => {
      if (node) {
        const dismissEvt = new CustomEvent<FocusEvent>("dismissed", {
          bubbles: true,
        });
        const dismiss = (e) => {
          document.body.style.pointerEvents = "auto";
          onLoseFocus();
        };

        const blurHandler = (e: FocusEvent) => {
          if (e.relatedTarget && node.contains(e.relatedTarget as Node)) return;
          node.dispatchEvent(dismissEvt);
        };

        const dismissHandler = (e: typeof dismissEvt) => {
          dismiss(e);
        };

        const pointerUpHanlder = (e: PointerEvent) => {
          if (e.target === node) return;
          node.dispatchEvent(dismissEvt);
        };

        const keepActiveFocusHandler = (e: FocusEvent) => {
          const active = document.activeElement as HTMLElement;
          if (active === node) {
            active.focus();
            e.stopPropagation();
          }
        };

        // actual blur evt
        node.addEventListener("blur", blurHandler, true);

        // custom evt
        node.addEventListener("dismissed", dismissHandler);

        // for pointer interaction on dismissable
        node.addEventListener("pointerup", pointerUpHanlder, false);

        // for clicking outside of page
        document.body.addEventListener("blur", keepActiveFocusHandler, true);

        return () => {
          node.removeEventListener("blur", blurHandler, true);
          node.removeEventListener("dismissed", dismissHandler);
          node.removeEventListener("pointerup", pointerUpHanlder);
          document.body.removeEventListener(
            "blur",
            keepActiveFocusHandler,
            true
          );
        };
      }
    }, [node, onLoseFocus]);

    return <Compose {...props} ref={composedRef} />;
  }
);

export default Dismissable;
