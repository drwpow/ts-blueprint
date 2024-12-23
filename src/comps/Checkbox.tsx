import type { ReactNode } from "react";
import {
  type CheckboxProps,
  Checkbox as RACheckbox,
} from "react-aria-components";
import "../styles/Checkbox.css";
import "../styles/CheckboxGroup.css";

export default function Checkbox({
  children,
  ...rest
}: CheckboxProps & { children: ReactNode }) {
  return (
    <RACheckbox {...rest}>
      <div className="checkbox">
        <svg aria-hidden="true" viewBox="0 0 18 18">
          <polyline points="1 9 7 14 15 4" />
        </svg>
      </div>
      {children}
    </RACheckbox>
  );
}
