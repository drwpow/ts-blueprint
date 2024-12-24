import type { ReactNode } from "react";
import {
  Button,
  DialogTrigger,
  Heading,
  type PopoverProps,
} from "react-aria-components";
import Popover from "./Popover.js";
import "../styles/Dialog.css";
import "../styles/Button.css";
import "../styles/Popover.css";
import "./InfoPanel.css";

export interface InfoPanelProps extends PopoverProps {
  children?: ReactNode;
  title?: ReactNode;
}

export default function InfoPanel({
  children,
  title,
  ...rest
}: InfoPanelProps) {
  return (
    <DialogTrigger>
      <Button aria-label="Help">ⓘ</Button>
      <Popover {...rest}>
        <div className="infopanel">
          <Heading slot="title" level={3}>
            {title}
          </Heading>
          {children}
        </div>
      </Popover>
    </DialogTrigger>
  );
}
