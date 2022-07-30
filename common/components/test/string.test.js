import stringHelper from "../utils/string.js";

describe("stringHelper", () => {
  test("isEmptyOrWhitespace", () => {
    expect(stringHelper.isEmptyOrWhitespace(" ")).toEqual(true);
    expect(stringHelper.isEmptyOrWhitespace("")).toEqual(true);
    expect(stringHelper.isEmptyOrWhitespace(undefined)).toEqual(true);
    expect(stringHelper.isEmptyOrWhitespace(" notwhitespace ")).toEqual(false);
  });

  test("trimStartString", () => {
    const trimmed = stringHelper.trimStartString("prefix_suffix", "prefix_");
    expect(trimmed).toEqual("suffix");

    const trimmedFromSubstrings = stringHelper.trimStartString(
      "prefix1_prefix2_suffix",
      ["prefix1_", "prefix2_"]
    );
    expect(trimmedFromSubstrings).toEqual("suffix");
  });

  test("startsWithAny", () => {
    let substringList = ["aa", "bb"];
    expect(stringHelper.startsWithAny("bb", substringList)).toEqual(true);
    expect(stringHelper.startsWithAny("aa", substringList)).toEqual(true);

    expect(stringHelper.startsWithAny("ab", substringList)).toEqual(false);
    expect(stringHelper.startsWithAny("", substringList)).toEqual(false);
    expect(stringHelper.startsWithAny(undefined, substringList)).toEqual(false);
  });

  test("isValidSlug", () => {
    const validSlugs = [
      "hello",
      "hello-goodbye",
      "deep-6ed",
      "Capital-Idea",
      "",
    ];
    const invalidSlugs = ["!", "hello@somewhere.com", "Space Slug"];

    validSlugs.forEach(slug =>
      expect(stringHelper.isValidSlug(slug)).toEqual(true)
    );
    invalidSlugs.forEach(slug =>
      expect(stringHelper.isValidSlug(slug)).toEqual(false)
    );
  });
});
