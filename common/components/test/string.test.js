import stringHelper from "../utils/string.js";

describe("stringHelper", () => {
  test("trimStartString", () => {
    const trimmed = stringHelper.trimStartString("prefix_suffix", "prefix_");
    expect(trimmed).toEqual("suffix");
  });
});
