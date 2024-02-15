import { cloneElement } from "react";
import { usePresence } from "../../hooks/usePresence";

type PresenceProp = {
  children: React.ReactElement;
  present: boolean;
};

// Custom Component should forward its ref to pass down props to rael the DOM element
export default function Presence({
  children,
  present,
  ...props
}: PresenceProp) {
  const { mounted, animate, setNode } = usePresence({
    trigger: present,
    initial: false,
  });

  if (!mounted || animate === "idle") return null;

  const presenceData = {
    "data-presence": animate ? "true" : "false",
    ref: setNode,
  };

  return cloneElement(children, { ...presenceData, ...props });
}
