import stringHelper from "../utils/string.js";

describe("stringHelper", () => {
  test("trimStartString", () => {
    const trimmed = stringHelper.trimStartString("prefix_suffix", "prefix_");
    expect(trimmed).toEqual("suffix");

    const trimmedFromSubstrings = stringHelper.trimStartString(
      "prefix1_prefix2_suffix",
      ["prefix1_", "prefix2_"]
    );
    expect(trimmedFromSubstrings).toEqual("suffix");
  });
});
