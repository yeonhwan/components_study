// types needed
import React, { forwardRef } from "react";
import Slot from "./Slot";

const nodes = ["div", "a", "button", "input", "span"] as const;

type PropsWithRef<T extends React.ElementType> =
  React.ComponentPropsWithRef<T> & { asChild: boolean };

type Primitives = {
  [T in (typeof nodes)[number]]: React.ForwardRefExoticComponent<
    PropsWithRef<T>
  >;
};

/**
 * ^ Primitive
 * ^ Baseline Components for all abstracted components(for calc props & refs & component logics)
 *
 *
 *  returns primitive nodes (div, a, button, input, span...)
 *  if asChild is true
 *  it will return Slot (not return baseline node but return custom children node)
 *
 */

const Primitive = nodes.reduce((acc, node) => {
  const Node = forwardRef(
    ({ asChild = false, ...props }: PropsWithRef<typeof node>, forwardRef) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const Element: any = asChild ? Slot : node;

      return <Element {...props} ref={forwardRef} />;
    }
  );

  return {
    ...acc,
    [node]: Node,
  };
}, {}) as Primitives;

export default Primitive;
