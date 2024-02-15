type ComposableRef =
  | ((node: HTMLElement | null) => void)
  | React.MutableRefObject<HTMLElement | null>
  | null;

export const composeRef = (...refs: ComposableRef[]) => {
  return (node: HTMLElement) => {
    refs.forEach((ref) => {
      setRef(node, ref);
    });
  };
};

const setRef = (node: HTMLElement, ref: ComposableRef) => {
  if (typeof ref === "function") {
    ref(node);
  } else if (ref) {
    ref.current = node;
  }
};
