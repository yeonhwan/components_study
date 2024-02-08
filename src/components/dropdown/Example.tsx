import * as Dropdown from "./Dropdown";
import { useState } from "react";
import "../dropdown/dropdown.css";

export type ExampleProps = {
  item: [];
};

export default function Example({ data }: ExampleProps) {
  const [checkData, setCheckData] = useState(0);

  return (
    <Dropdown.Root>
      <Dropdown.Collpased>Open</Dropdown.Collpased>
      <Dropdown.Menu className="dropdown__list">
        <Dropdown.Title className="dropdown__list__title">Title</Dropdown.Title>
        <Dropdown.Separate className="dropdown__list__separate" />
        <Dropdown.Group className="dropdown__list__group">
          <Dropdown.Item
            checked={checkData === 0}
            onClick={() => setCheckData(0)}
            className="dropdown__list__item"
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4.18179 6.18181C4.35753 6.00608 4.64245 6.00608 4.81819 6.18181L7.49999 8.86362L10.1818 6.18181C10.3575 6.00608 10.6424 6.00608 10.8182 6.18181C10.9939 6.35755 10.9939 6.64247 10.8182 6.81821L7.81819 9.81821C7.73379 9.9026 7.61934 9.95001 7.49999 9.95001C7.38064 9.95001 7.26618 9.9026 7.18179 9.81821L4.18179 6.81821C4.00605 6.64247 4.00605 6.35755 4.18179 6.18181Z"
                  fill="currentColor"
                ></path>
              </svg>
              Item 1
            </div>
          </Dropdown.Item>
          <Dropdown.Item
            disabled
            checked={checkData === 1}
            onClick={() => setCheckData(1)}
            className="dropdown__list__item"
          >
            Item 2
          </Dropdown.Item>
          <Dropdown.Item
            checked={checkData === 2}
            onClick={() => setCheckData(2)}
            className="dropdown__list__item"
          >
            Item 3
          </Dropdown.Item>
          <Dropdown.Item
            checked={checkData === 3}
            onClick={() => setCheckData(3)}
            className="dropdown__list__item"
          >
            Item 4
          </Dropdown.Item>
          <Dropdown.Item
            checked={checkData === 4}
            onClick={() => setCheckData(4)}
            className="dropdown__list__item"
          >
            Item 5
          </Dropdown.Item>
          <Dropdown.Item
            checked={checkData === 5}
            onClick={() => setCheckData(5)}
            className="dropdown__list__item"
          >
            Item 6
          </Dropdown.Item>
          <Dropdown.Item
            checked={checkData === 6}
            onClick={() => setCheckData(6)}
            className="dropdown__list__item"
          >
            Item 7
          </Dropdown.Item>
        </Dropdown.Group>
      </Dropdown.Menu>
    </Dropdown.Root>
  );
}
