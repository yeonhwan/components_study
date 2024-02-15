import * as Dropdown from "../Dropdown";
import { useState } from "react";
import "../dropdown.css";

export type ExampleProps = {
  data: [];
};

export default function Example({ data }: ExampleProps) {
  const [status, setStatus] = useState(true);
  const [previous, setPrevious] = useState(false);
  const [keepOpen, setKeepOpen] = useState(false);

  return (
    <Dropdown.Root>
      <Dropdown.Collapsed className="dropdown__collapsed" asChild>
        <div>Open</div>
      </Dropdown.Collapsed>
      <Dropdown.Menu className="dropdown__list">
        <Dropdown.Label className="dropdown__list__title">Title</Dropdown.Label>
        <Dropdown.Separate className="dropdown__list__separate" />
        <Dropdown.Group
          mode="check"
          items={{ iconWidth: 20, iconHeight: 20 }}
          className="dropdown__list__group"
        >
          <Dropdown.Item
            checked={status}
            onClick={() => setStatus(!status)}
            className="dropdown__list__item"
          >
            Status Bar
          </Dropdown.Item>
          <Dropdown.Item
            disabled
            checked={false}
            className="dropdown__list__item"
          >
            Panel
          </Dropdown.Item>
          <Dropdown.Item
            checked={previous}
            onClick={() => setPrevious(!previous)}
            className="dropdown__list__item"
          >
            Remember previous
          </Dropdown.Item>
          <Dropdown.Item
            checked={keepOpen}
            onClick={() => setKeepOpen(!keepOpen)}
            className="dropdown__list__item"
          >
            Keep open
          </Dropdown.Item>
        </Dropdown.Group>
      </Dropdown.Menu>
    </Dropdown.Root>
  );
}
