import * as Dropdown from "../Dropdown";
import { useState } from "react";
import "../dropdown.css";

export type ExampleProps = {
  data: [];
};

export default function Example({ data }: ExampleProps) {
  const [direction, setDirection] = useState("top");

  return (
    <Dropdown.Root>
      <Dropdown.Collpased className="dropdown__collapsed">
        Open
      </Dropdown.Collpased>
      <Dropdown.Menu className="dropdown__list">
        <Dropdown.Label className="dropdown__list__title">
          Panel Position
        </Dropdown.Label>
        <Dropdown.Separate className="dropdown__list__separate" />
        <Dropdown.Group
          mode="radio"
          sharedState={direction}
          onChange={setDirection}
          items={{ iconWidth: 20, iconHeight: 20 }}
          className="dropdown__list__group"
        >
          <Dropdown.Item value="top" className="dropdown__list__item">
            Top
          </Dropdown.Item>
          <Dropdown.Item
            disabled
            value="bottom"
            className="dropdown__list__item"
          >
            Bottom
          </Dropdown.Item>
          <Dropdown.Item value="left" className="dropdown__list__item">
            Left
          </Dropdown.Item>
          <Dropdown.Item value="right" className="dropdown__list__item">
            Right
          </Dropdown.Item>
        </Dropdown.Group>
      </Dropdown.Menu>
    </Dropdown.Root>
  );
}
