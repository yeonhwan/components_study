/* eslint-disable @typescript-eslint/no-explicit-any*/
import React from "react";
import { composeRef } from "../../hooks/composeRef";

type ComposeProps = {
  children: React.ReactElement;
} & React.HTMLAttributes<HTMLElement>;

/**
 * ^ Recieve: props & forwardRef + children
 * ^ Returns: composedElement(Children)
 * compose children with slot prop & ref (passed by Parent)
 *
 */

const Compose = React.forwardRef<HTMLElement, ComposeProps>(
  ({ children, ...props }, forwardRef) => {
    const composedRef = composeRef(forwardRef, (children as any).ref);
    if (React.isValidElement(children)) {
      return React.cloneElement<any>(children, {
        ...mergeProps(props, children.props),
        ref: forwardRef ? composedRef : (children as any).ref,
      });
    }

    return React.Children.count(children) > 1
      ? React.Children.only(null)
      : null;
  }
);

type AnyProps = Record<string, any>;

function mergeProps(props: AnyProps, childProps: AnyProps) {
  const overrideProps = { ...childProps };

  for (const key in childProps) {
    const propValue = props[key];
    const childPropValue = childProps[key];

    const isHandler = /^on[A-Z]/.test(key);

    if (isHandler) {
      if (propValue === childPropValue) {
        overrideProps[key] = (...args: unknown[]) => {
          propValue(...args);
          childPropValue(...args);
        };
      } else if (propValue) {
        overrideProps[key] = propValue;
      }
    } else if (key === "style") {
      overrideProps[key] = { ...propValue, ...childPropValue };
    } else if (propValue === "className") {
      overrideProps[key] = [propValue, childPropValue]
        .filter(Boolean)
        .join(" ");
    }
  }

  return { ...props, ...overrideProps };
}

export default Compose;
