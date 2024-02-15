// // todo: 1. auto detect open direction
// // todo: 2. modes | groups
//^ CLEAN UP | REFACTOR

// todo: 2. asChild
// todo: 3. submenus
// todo: 4. roving focus
// todo: 5. theme mode

import { useState, createContext, useContext, useRef, forwardRef } from "react";
import type {
  Dispatch,
  HTMLAttributes,
  MutableRefObject,
  ReactElement,
  SetStateAction,
} from "react";
import { Popper } from "../popper/Popper";
import Dismissable from "../utils/Dismissable";
import CheckIcon from "../icon/Check";
import DotIcon from "../icon/Dot";
import Primitive from "../primitives/Primitive";

type DropdownContextType = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  root: MutableRefObject<HTMLElement | null>;
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

// --------------------------------------
// ROOT
// Inside state: open

type DropdownRootProps = {
  children: ReactElement[];
} & HTMLAttributes<HTMLDivElement>;

function Root({ children, ...props }: DropdownRootProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  return (
    <DropdownContext.Provider value={{ open, setOpen, root: rootRef }}>
      <div className="dropdown__wrapper" ref={rootRef} {...props}>
        {children}
      </div>
    </DropdownContext.Provider>
  );
}

//--------------------------------------
// Collapsed

type DropdownCollpasedProps = {
  children: React.ReactElement | string;
  asChild?: boolean;
} & HTMLAttributes<HTMLButtonElement>;

function Collapsed({
  asChild = false,
  children,
  ...props
}: DropdownCollpasedProps) {
  const { open, setOpen } = useContext(DropdownContext)!;

  return (
    <Primitive.button
      asChild={asChild}
      children={children}
      onClick={() => setOpen(!open)}
      {...props}
    />
  );
}

// --------------------------------------
// MENU

type DropdownMenuProps = {
  children: ReactElement[];
} & HTMLAttributes<HTMLDivElement>;

function Menu({ ...props }: DropdownMenuProps) {
  const listRef = useRef<HTMLDivElement>(null);

  const {
    open,
    root: { current: root },
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

    return (
      <Dismissable
        ref={forwardRef}
        onLoseFocus={() => {
          console.log("lost focus");
          setOpen(false);
        }}
      >
        <div tabIndex={-1} {...props} style={{ pointerEvents: "auto" }}>
          {children}
        </div>
      </Dismissable>
    );
  }
);

// --------------------------------------
// LABEL

type LabelProps = {
  children: React.ReactNode;
  asChild?: boolean;
} & HTMLAttributes<HTMLDivElement>;

function Label({ asChild = false, children, ...props }: LabelProps) {
  return (
    <Primitive.div
      asChild={asChild}
      {...props}
      style={{ pointerEvents: "none" }}
    >
      {children}
    </Primitive.div>
  );
}

// --------------------------------------
// GROUP

type MenuGroupContextType = {
  items?: {
    iconWidth?: number;
    iconHeight?: number;
  };
  mode: "default" | "check" | "radio";
  radio?: {
    sharedState?: string | undefined;
    onChange?: (value: string) => void;
  };
} | null;

const MenuGroupContext = createContext<MenuGroupContextType>(null);
const useMenuGroupContext = () => {
  const state = useContext(MenuGroupContext);
  if (!state)
    throw new Error(
      "Dropdown compound components cannot be rendered outside the Dropdown component"
    );

  return state;
};

type MenuGroupProps = {
  mode: "default" | "check" | "radio";
  sharedState?: string;
  onChange?: (value: string) => void;
  asChild?: boolean;
  items?: {
    iconWidth?: number;
    iconHeight?: number;
  };

  children: React.ReactElement[];
} & Omit<HTMLAttributes<HTMLDivElement>, "onChange">;

function Group({
  children,
  items,
  mode = "default",
  sharedState,
  onChange,
  asChild = false,
  ...props
}: MenuGroupProps) {
  if (mode === "radio" && !sharedState) {
    throw new Error("Radio group must have a shared state");
  }

  const radioState = mode === "radio" ? { sharedState, onChange } : undefined;

  return (
    <Primitive.div
      asChild={asChild}
      {...props}
      style={{ pointerEvents: "none" }}
    >
      <MenuGroupContext.Provider value={{ items, mode, radio: radioState }}>
        {children}
      </MenuGroupContext.Provider>
    </Primitive.div>
  );
}

// --------------------------------------
// SEPARATE

function Separate({ ...props }) {
  return <Primitive.div asChild={false} {...props}></Primitive.div>;
}

type ItemProps = {
  children: React.ReactElement | string;
  disabled?: boolean;
  checked?: boolean;
  onClick?: () => void;
  value?: string;
  asChild?: boolean;
} & HTMLAttributes<HTMLDivElement>;

// --------------------------------------
// ITEM

function Item({
  children,
  disabled,
  checked,
  onClick,
  value,
  asChild = false,
  ...props
}: ItemProps) {
  const { mode, items, radio } = useMenuGroupContext();

  const icon = { width: items?.iconWidth, height: items?.iconHeight };
  const { sharedState, onChange } = radio ?? {};

  const clickHandler = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (mode === "radio") {
      const value = (e.target as HTMLElement).getAttribute("data-value")!;
      onChange?.(value);
      return;
    }

    onClick?.();
  };

  const preventDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  };

  if (mode === "radio") {
    checked = value === sharedState;
  }

  return (
    <Primitive.div
      asChild={asChild}
      data-checked={checked ? "true" : ""}
      data-disabled={disabled ? "true" : ""}
      style={{
        pointerEvents: disabled ? "none" : "auto",
      }}
      onPointerUp={clickHandler}
      onMouseDown={preventDrag}
      onMouseMove={preventDrag}
      tabIndex={-1}
      data-value={value}
      {...props}
    >
      {mode !== "default" && (
        <ItemIcon mode={mode} style={{ opacity: checked ? 1 : 0, ...icon }} />
      )}
      {children}
    </Primitive.div>
  );
}

type ItemIconProps = {
  mode: "check" | "radio";
  style: React.CSSProperties;
} & HTMLAttributes<SVGSVGElement>;

function ItemIcon({ mode, style, ...props }: ItemIconProps) {
  if (mode === "check") {
    return <CheckIcon {...props} style={style} />;
  }

  return <DotIcon {...props} style={style} />;
}

export { Root, List, Menu, Item, Label, Group, Separate, Collapsed };
