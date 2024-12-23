import { useEffect, useState } from "react";
import {
  Button,
  type ButtonProps,
  OverlayArrow,
  Tooltip,
  TooltipTrigger,
} from "react-aria-components";
import "../styles/Button.css";
import "../styles/Tooltip.css";

export interface CopyButtonProps extends ButtonProps {
  text: string;
}

export default function CopyButton({ text, ...rest }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    let timeout: number;
    if (copied) {
      timeout = window.setTimeout(() => {
        setCopied(false);
      }, 2_000);
    }
    return () => clearTimeout(timeout);
  }, [copied]);

  return (
    <TooltipTrigger>
      <Button
        {...rest}
        aria-label="Copy to clipboard"
        onPress={() => {
          navigator.clipboard.writeText(text);
          setCopied(true);
        }}
      >
        {copied ? (
          <svg
            aria-hidden={true}
            stroke="currentColor"
            fill="none"
            strokeWidth="0"
            viewBox="0 0 15 15"
            width="15"
            height="15"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z"
              fill="currentColor"
            />
          </svg>
        ) : (
          <svg
            aria-hidden={true}
            stroke="currentColor"
            fill="none"
            strokeWidth="0"
            viewBox="0 0 15 15"
            width="15"
            height="15"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M5 2V1H10V2H5ZM4.75 0C4.33579 0 4 0.335786 4 0.75V1H3.5C2.67157 1 2 1.67157 2 2.5V12.5C2 13.3284 2.67157 14 3.5 14H11.5C12.3284 14 13 13.3284 13 12.5V2.5C13 1.67157 12.3284 1 11.5 1H11V0.75C11 0.335786 10.6642 0 10.25 0H4.75ZM11 2V2.25C11 2.66421 10.6642 3 10.25 3H4.75C4.33579 3 4 2.66421 4 2.25V2H3.5C3.22386 2 3 2.22386 3 2.5V12.5C3 12.7761 3.22386 13 3.5 13H11.5C11.7761 13 12 12.7761 12 12.5V2.5C12 2.22386 11.7761 2 11.5 2H11Z"
              fill="currentColor"
            />
          </svg>
        )}
      </Button>
      <Tooltip>
        <OverlayArrow>
          <svg aria-hidden={true} width={8} height={8} viewBox="0 0 8 8">
            <path d="M0 0 L4 4 L8 0" />
          </svg>
        </OverlayArrow>
        Copy to Clipboard
      </Tooltip>
    </TooltipTrigger>
  );
}
