import { describe, expect, test } from "vitest";
import { getUser } from "./index.js";

describe("my app", () => {
  test("user", () => {
    expect(getUser("1")).toEqual({ id: "1" });
  });
});
