export const useComposedRef = (...refs: unknown[]) => {
  return (node) => {
    refs.forEach((ref) => {
      setRef(node, ref);
    });
  };
};

const setRef = (node, ref) => {
  if (typeof ref === "function") {
    ref(node);
  } else if (ref) {
    ref.current = node;
  }
};
