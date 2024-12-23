import { useState } from "react";
import { Checkbox, Label, Radio, RadioGroup } from "react-aria-components";
import type { Linter } from "../lib/builder/index.js";
import "../styles/Checkbox.css";
import "../styles/Form.css";
import "../styles/RadioGroup.css";
import type { Module } from "../lib/types.js";
import "./builder.css";

export default function Builder() {
  const [module, setModule] = useState<Module>("esm");
  const [linter, setLinter] = useState<Linter>("biome");

  return (
    <div className="builder">
      <RadioGroup
        value={module}
        onChange={(value) => setModule(value as Module)}
      >
        <Label>Module</Label>
        <Radio value="esm">ESM (Recommended)</Radio>
        <Radio value="cjs">CommonJS</Radio>
      </RadioGroup>
      <RadioGroup
        value={linter}
        onChange={(value) => setLinter(value as Linter)}
      >
        <Label>Linter</Label>
        <Radio value="biome">Biome (Recommended)</Radio>
        <Radio value="eslint">ESLint</Radio>
      </RadioGroup>
      <Checkbox>CLI</Checkbox>
    </div>
  );
}
