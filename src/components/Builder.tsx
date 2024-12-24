import { useEffect, useState } from "react";
import {
  Label,
  Radio,
  RadioGroup,
  Tab,
  TabList,
  TabPanel,
  Tabs,
} from "react-aria-components";
import { type Highlighter, createHighlighter } from "shiki";
import { type Linter, pkgBuilder } from "../lib/builder/index.js";
import type { Framework, Module, Test } from "../lib/types.js";
import "../styles/Button.css";
import "../styles/Form.css";
import "../styles/RadioGroup.css";
import "../styles/Tabs.css";
import "./Builder.css";
import Checkbox from "./Checkbox.js";
import CodePanel, { THEME } from "./CodePanel.js";
import InfoPanel from "./InfoPanel.js";

export default function Builder() {
  const [highlighter, setHighlighter] = useState<Highlighter>();
  const [framework, setFramework] = useState<Framework>("nodejs");
  const [module, setModule] = useState<Module>("esm");
  const [linter, setLinter] = useState<Linter>("biome");
  const [cli, setCLI] = useState(false);
  const [test, setTest] = useState<Test>("vitest");

  useEffect(() => {
    createHighlighter({
      themes: [THEME],
      langs: ["javascript", "typescript", "json"],
    }).then(setHighlighter);
  }, []);

  const files = pkgBuilder({
    settings: {
      framework,
      module,
      linter,
      test,
      cli,
    },
  });

  return (
    <div className="builder">
      <section className="builder-settings">
        <RadioGroup
          value={framework}
          onChange={(value) => setFramework(value as Framework)}
        >
          <Label className="builder-setting-label">
            Framework
            <InfoPanel title="Framework">
              <p>
                The type of library this is. While there are many other
                frameworks out there—too many to include in this tool—these are
                the most common.
              </p>
            </InfoPanel>
          </Label>
          <Radio value="nodejs">Vanilla JS / Node.js</Radio>
          <Radio value="react">React</Radio>
          <Radio value="vue">Vue</Radio>
          <Radio value="svelte">Svelte</Radio>
        </RadioGroup>
        <RadioGroup
          value={linter}
          onChange={(value) => setLinter(value as Linter)}
        >
          <Label>Linter</Label>
          <Radio value="biome">Biome (Recommended)</Radio>
          <Radio value="eslint">ESLint</Radio>
        </RadioGroup>
        <RadioGroup value={test} onChange={(value) => setTest(value as Test)}>
          <Label>Test</Label>
          <Radio value="vitest">Vitest</Radio>
          <Radio value="jest">Jest</Radio>
        </RadioGroup>
        <Checkbox value="true" onChange={setCLI}>
          Include CLI?
        </Checkbox>
      </section>

      <section className="builder-tabs">
        <Tabs>
          <div className="builder-tablist">
            <div className="builder-tablist-wrap">
              <TabList>
                {files.map((file) => (
                  <Tab key={file.filename} id={file.filename}>
                    {file.filename}
                  </Tab>
                ))}
              </TabList>
            </div>
          </div>
          {files.map((file) => (
            <TabPanel key={file.filename} id={file.filename}>
              <CodePanel
                highlighter={highlighter}
                language={file.language}
                contents={file.contents}
              />
            </TabPanel>
          ))}
        </Tabs>
      </section>
    </div>
  );
}
