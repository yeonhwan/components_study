import { useState, useEffect, useLayoutEffect, useCallback } from "react";
import { flushSync } from "react-dom";

type animateState = boolean | "idle";

export const usePresence = ({
  trigger,
  initial,
}: {
  trigger: boolean;
  initial: boolean;
}) => {
  const [node, setNode] = useState<HTMLElement>();
  const [mounted, setMounted] = useState(initial);
  const [animate, setAnimate] = useState<animateState>("idle");

  useEffect(() => {
    if (trigger && !mounted) {
      setMounted(true);
    }

    if (!trigger && animate === true) {
      setAnimate(false);
    }
  }, [trigger, mounted, animate]);

  useEffect(() => {
    if (mounted) {
      setAnimate(true);
    }
  }, [mounted]);

  const animationTrigger = useCallback(() => {
    if (!trigger && !animate) {
      flushSync(() => setMounted(false));
      setAnimate("idle");
    }
  }, [trigger, animate]);

  useLayoutEffect(() => {
    if (node) {
      node.addEventListener("animationend", animationTrigger);
      node.addEventListener("animationcancel", animationTrigger);
    }

    return () => {
      if (node) {
        node.removeEventListener("animationend", animationTrigger);
        node.removeEventListener("animationcancel", animationTrigger);
      }
    };
  }, [node, animationTrigger]);

  return {
    mounted,
    animate,
    setNode: useCallback((node: HTMLElement) => {
      setNode(node);
    }, []),
  };
};
