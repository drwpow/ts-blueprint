import { useEffect, useState } from "react";
import type { Highlighter } from "shiki";
import type { File } from "../lib/types.js";
import CodePanel from "./CodePanel.js";
import "./FileBrowser.css";

export interface FileBrowserProps {
  files: File[];
  highlighter?: Highlighter;
}

export default function FileBrowser({ files, highlighter }: FileBrowserProps) {
  const [currentFile, setCurrentFile] = useState(files[0]?.filename!);

  // biome-ignore lint/correctness/useExhaustiveDependencies: Incorrect lint
  useEffect(() => {
    // Any time the list of files changes, reset current file to first one
    setCurrentFile(files[0]?.filename!);
  }, [files.map((f) => f.filename).join(",")]);

  function selectTab(index: number, evt: React.KeyboardEvent) {
    setCurrentFile(files[index]?.filename!);
    const tab = document.getElementById(tabId(index));
    if (tab) {
      tab.focus();
    }
    evt.preventDefault();
  }

  return (
    <div className="filebrowser">
      <ul className="filebrowser-tablist" role="tablist">
        {files.map((file, i) => {
          const isSelected = currentFile === file.filename;
          return (
            <li key={file.filename} role="presentation">
              <button
                className="filebrowser-tab"
                type="button"
                id={tabId(i)}
                role="tab"
                onClick={() => setCurrentFile(file.filename)}
                aria-controls={tabPanelId(i)}
                aria-selected={isSelected}
                tabIndex={isSelected ? 0 : -1}
                onKeyDown={(evt) => {
                  /** @see https://www.w3.org/WAI/ARIA/apg/patterns/tabs/ */
                  switch (evt.key) {
                    case "ArrowDown": {
                      selectTab(Math.min(i + 1, files.length - 1), evt);
                      break;
                    }
                    case "ArrowUp": {
                      selectTab(Math.max(i - 1, 0), evt);
                      break;
                    }
                    case "PageDown": {
                      selectTab(files.length - 1, evt);
                      break;
                    }
                    case "PageUp": {
                      selectTab(0, evt);
                      break;
                    }
                  }
                }}
              >
                {file.filename}
              </button>
            </li>
          );
        })}
      </ul>
      <div className="filebrowser-contents">
        {files.map((file, i) => {
          const isSelected = currentFile === file.filename;
          return (
            <div
              key={file.filename}
              id={tabPanelId(i)}
              role="tabpanel"
              hidden={!isSelected}
              className="filebrowser-code"
            >
              <CodePanel
                highlighter={highlighter}
                language={file.language}
                contents={file.contents.trim()}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function tabId(index: number) {
  return `code-tab-${index}`;
}

function tabPanelId(index: number) {
  return `code-${index}`;
}
