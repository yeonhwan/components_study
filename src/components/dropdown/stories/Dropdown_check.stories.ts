import type { Meta, StoryObj } from "@storybook/react";

import Example from "../example/Check";

const meta = {
  title: "example/Dropdown/check",
  component: Example,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    data: { control: "array" },
  },
} satisfies Meta<typeof Example>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Single: Story = {
  args: {
    data: ["item1", "item2"],
  },
};
