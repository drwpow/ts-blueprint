import type { ReactNode } from "react";
import {
  Dialog,
  OverlayArrow,
  type PopoverProps,
  Popover as RAPopover,
} from "react-aria-components";
import "../styles/Dialog.css";
import "../styles/Popover.css";

export default function Popover({
  children,
  ...props
}: PopoverProps & { children: ReactNode }) {
  return (
    <RAPopover {...props}>
      <OverlayArrow>
        <svg aria-hidden={true} width={12} height={12} viewBox="0 0 12 12">
          <path d="M0 0 L6 6 L12 0" />
        </svg>
      </OverlayArrow>
      <Dialog>{children}</Dialog>
    </RAPopover>
  );
}
