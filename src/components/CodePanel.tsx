import {
  transformerMetaHighlight,
  transformerRenderWhitespace,
} from "@shikijs/transformers";
import { useMemo } from "react";
import type { Highlighter } from "shiki";
import type { File } from "../lib/types.js";
import CopyButton from "./CopyButton.js";
import "./CodePanel.css";

export const THEME = "catppuccin-macchiato";

export interface CodePanelProps {
  highlighter?: Highlighter;
  language: File["language"];
  contents: File["contents"];
}

export default function CodePanel({
  highlighter,
  language,
  contents,
}: CodePanelProps) {
  if (!highlighter) {
    return null;
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: Not needed
  const __html = useMemo(
    () =>
      highlighter.codeToHtml(contents, {
        lang: language,
        theme: THEME,
        meta: { __raw: "{1,3-5}" },
        transformers: [
          transformerMetaHighlight(),
          transformerRenderWhitespace(),
        ],
      }),
    [contents],
  );

  return (
    <div className="codepanel">
      <div
        // biome-ignore lint/security/noDangerouslySetInnerHtml: This is generated locally and does not allow arbitrary execution
        dangerouslySetInnerHTML={{ __html }}
      />
      <div className="codepanel-copy">
        <CopyButton text={contents} />
      </div>
    </div>
  );
}
