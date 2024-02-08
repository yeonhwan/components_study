//todo) 1. dismissability
//todo) 2. focus management

//---
//todo) 3. change mode (radio / checkbox / default)
//---
//todo) 4. change position
//todo) 5. collision detection

//---
//todo) 6. sub menus

import {
  useState,
  createContext,
  useContext,
  useRef,
  forwardRef,
  useEffect,
} from "react";
import type { Dispatch, ReactElement, SetStateAction } from "react";
import { Popper } from "../popper/Popper";
import { useComposedRef } from "../../hooks/useComposedRef";
import Compose from "../utils/Compose";

type DropdownContextType = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
} | null;

const DropdownContext = createContext<DropdownContextType>(null);
const useDropdownContext = () => {
  const state = useContext(DropdownContext);
  if (!state)
    throw new Error(
      "Dropdown compound components cannot be rendered outside the Dropdown component"
    );

  return state;
};

function Root({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const context = {
    root: rootRef.current,
  };

  useEffect(() => {
    console.log("open changed", open);
    console.log("-------------------");
  });

  return (
    <DropdownContext.Provider value={{ open, setOpen, context }}>
      <div className="dropdown__wrapper" ref={rootRef}>
        {children}
      </div>
    </DropdownContext.Provider>
  );
}

function Collpased({
  children,
  asChild = false,
}: {
  children: React.ReactNode;
  asChild?: boolean;
}) {
  const state = useContext(DropdownContext);
  if (!state)
    throw new Error(
      "Dropdown compound components cannot be rendered outside the Dropdown component"
    );
  const { open, setOpen } = state;

  if (children && asChild && children instanceof Object) {
    children.onClick = () => setOpen(!open);
    return children;
  }

  return (
    <div onClick={() => setOpen(!open)} className="dropdown__collapsed">
      {children}
    </div>
  );
}

type MenuProps = {
  children: ReactElement[];
};

function Menu({ mode, ...props }: MenuProps) {
  const listRef = useRef<HTMLDivElement>(null);

  const {
    open,
    context: { root },
  } = useDropdownContext();

  return (
    <Popper anchor={root} state={open}>
      <List ref={listRef} {...props} />
    </Popper>
  );
}

const List = forwardRef(
  ({ children, ...props }: { children: ReactElement[] }, forwardRef) => {
    const { open, setOpen } = useDropdownContext();

    const handler = (e) => {
      console.log("focus event run");
      document.body.style.pointerEvents = "none";
    };

    const outHandler = (e) => {
      console.log("focusout event run");
      document.body.style.pointerEvents = "auto";
    };

    return (
      <Dismissable
        ref={forwardRef}
        onLoseFocus={() => {
          console.log("lost focus");
          setOpen(false);
        }}
      >
        <div tabIndex={-1} {...props}>
          {children}
        </div>
      </Dismissable>
    );
  }
);

const Dismissable = forwardRef(({ onLoseFocus, ...props }, forwardRef) => {
  const focusContext = useRef(new Set());
  const [node, setNode] = useState<HTMLElement | null>(null);
  const prevFocused = useRef(false);

  const autoFocus = (element) => {
    if (element && !prevFocused.current) {
      console.log(element, "focused?");
      element.focus();
      prevFocused.current = true;
    }
  };

  const refControl = (node) => {
    if (node) {
      setNode(node);
    }
  };
  const composedRef = useComposedRef(forwardRef, refControl, autoFocus);

  useEffect(() => {
    if (node) {
      const nodeList = Array.from(node.children);

      nodeList.forEach((node) => {
        focusContext.current.add(node);
      });

      const outHandler = (e) => {
        console.log(e.relatedTarget, "event rt");
        if (!focusContext.current.has(e.relatedTarget)) {
          console.log("dismissed");
          onLoseFocus();
        }
      };

      node.addEventListener("focusout", outHandler, true);
      node.addEventListener("blur", outHandler, true);

      return () => {
        node.removeEventListener("focusout", outHandler, true);
        node.removeEventListener("blur", outHandler, true);
      };
    }
  }, [node]);

  return <Compose {...props} ref={composedRef} />;
});

function Title({ children, ...props }: { children: React.ReactElement }) {
  return (
    <div
      onBlur={(e) => {
        console.log("title blur");
      }}
      {...props}
    >
      {children}
    </div>
  );
}

function Group({ children, ...props }: { children: React.ReactElement }) {
  return <div {...props}>{children}</div>;
}

function Separate({ ...props }) {
  return <div {...props}></div>;
}

function Item({
  children,
  disabled,
  checked,
  onClick,
  ...props
}: {
  children: React.ReactElement;
  disabled: boolean;
  checked: boolean;
  props: unknown[];
}) {
  const clickHandler = (e) => {
    console.log("item click");
    e.stopPropagation();
    onClick();
  };

  return (
    <div
      data-checked={checked ? "true" : ""}
      data-disabled={disabled ? "true" : ""}
      style={{
        pointerEvents: disabled || checked ? "none" : "auto",
      }}
      onMouseDown={clickHandler}
      {...props}
      tabIndex={-1}
    >
      {children}
    </div>
  );
}

export { Root, List, Menu, Item, Collpased, Group, Separate, Title };
