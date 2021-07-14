import async from "../utils/async.js";
import { Glyph } from "../utils/glyphs.js";
import Sort from "../utils/sort.js";
import Truncate from "../utils/truncate.js";
import urlHelper from "../utils/url.js";
import window from "./__mocks__/window";
import NavigationStore from "../stores/NavigationStore.js";
import renderer from "react-test-renderer";
import GroupBy from "../utils/groupBy.js";
import array from "../utils/array.js";

describe("utils", () => {
  test("async.doWhenReady", () => {
    const readyFunc = () => true;
    const doVoidFunc = jest.fn();

    async.doWhenReady(readyFunc, doVoidFunc, 1);
    expect(doVoidFunc).toBeCalled();
  });

  test("async.onEvent", () => {
    const eventName = "testEvent";
    const doVoidFunc = jest.fn();

    async.onEvent(eventName, doVoidFunc);
    global.dispatchEvent(new Event(eventName));
    expect(doVoidFunc).toBeCalled();
  });

  test("glyphs", () => {
    const glyph = Glyph("fa style", " class2", " class3");
    expect(glyph).toEqual("fa style class2 class3");
  });

  test("sort", () => {
    const collection = [
      { id: 0, type: "thing", name: "pen" },
      { id: 1, type: "special", name: "coin" },
      { id: 2, type: "thing", name: "straw" },
      { id: 3, type: "favorite", name: "crystal" },
    ];
    const order = ["favorite", "special"];
    const sorted = Sort.byNamedEntries(collection, order, obj => obj.type);

    expect(sorted.map(obj => obj.id)).toEqual([3, 1, 0, 2]);

    const group_issue_areas = {
      no: 2,
      en: 4,
      ed: 1,
      tr: 3,
    };
    const sorted_by_count_descending1 = Sort.byCountDictionary(
      group_issue_areas
    );
    expect(sorted_by_count_descending1).toEqual(["en", "tr", "no", "ed"]);

    const sorted_by_count_descending2 = Sort.byCountDictionary(
      group_issue_areas,
      false
    );
    expect(sorted_by_count_descending2).toEqual(sorted_by_count_descending1);

    const sorted_by_count_ascending = Sort.byCountDictionary(
      group_issue_areas,
      true
    );
    expect(sorted_by_count_ascending).toEqual(["ed", "no", "tr", "en"]);
  });

  test("truncate", () => {
    let str = "someday never comes";
    let lines = "one\ntwo\nthree\nfour";
    let arr = [1, 2, 3, 4];

    str = Truncate.stringT(str, 10);
    lines = Truncate.lines(lines, 3);
    arr = Truncate.arrayT(arr, 3);

    expect(str).toEqual("someday...");
    expect(lines.split("\n").length).toEqual(3);
    expect(arr).toEqual([1, 2, "2 more"]);
  });

  test("url", () => {
    expect(urlHelper.appendHttpIfMissingProtocol("testing.us")).toEqual(
      "http://testing.us"
    );
    expect(urlHelper.beautify("https://testing.us")).toEqual("testing.us");
    expect(urlHelper.beautify("http://testing.us")).toEqual("testing.us");

    urlHelper.navigateToSection("LogIn");
    expect(NavigationStore.getSection()).toEqual("LogIn");

    let url = urlHelper.section("FindProjects", { next: 1 });
    expect(url).toEqual("/projects?next=1");

    url = urlHelper.sectionOrLogIn("CreateProject");
    expect(url).toEqual("/projects/create/");

    url = urlHelper.constructWithQueryString("/api/test", { query: "test" });
    expect(url).toEqual("/api/test?query=test");

    const args = urlHelper.arguments("/projects?issues=test-issue&page=1");
    expect(args["issues"]).toEqual("test-issue");
    expect(args["page"]).toEqual("1");
  });

  test("isValidUrl validates URL correctly", () => {
    const urlLists = {
      valid: [
        "http://www.unsecure.com",
        "https://www.secure.com",
        "https://multiple.parts.com/subdir",
        "https://hyphenated-domain.next.com/",
        "https://www.gnarly.com/url/viewer.html?&something=d38d408127d64407a7" +
          "627f8e990908fe&view=388155.63,109.56,-69891.37,388028.5,247.89,-70" +
          "066.36,0.95&lyr=1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1&wk" +
          "id=2926&v=2",
      ],
      invalid: ["", "localhost:3000", "N/A", "TBD", "Not built yet"],
    };
    urlLists.valid.forEach(validUrl => {
      expect(urlHelper.isValidUrl(validUrl)).toEqual(true);
    });
    urlLists.invalid.forEach(invalidUrl => {
      expect(urlHelper.isValidUrl(invalidUrl)).toEqual(false);
    });
  });

  test("isEmptyStringOrValidUrl also accepts empty string", () => {
    expect(urlHelper.isEmptyStringOrValidUrl("")).toEqual(true);
  });

  test("logInThenReturn produces correct redirection urls", () => {
    const expectedWithArguments =
      '/login?prev=AboutProject&prevPageArgs={"id":"1"}';
    expect(urlHelper.logInThenReturn("/projects/1")).toEqual(
      expectedWithArguments
    );

    const expectedNoArguments = "/login?prev=FindProjects";
    expect(urlHelper.logInThenReturn("/projects/")).toEqual(
      expectedNoArguments
    );

    expect(urlHelper.logInThenReturn(expectedNoArguments)).toEqual(
      expectedNoArguments
    );
  });

  test("groupBy.andTransform", () => {
    const testData = [
      { a: 1, b: 2, type: "a" },
      { a: 2, b: 2, type: "b" },
    ];
    const result = GroupBy.andTransform(
      testData,
      i => i.type,
      i => ({ result: i.a + i.b })
    );
    expect(result).toMatchObject({ a: [{ result: 3 }], b: [{ result: 4 }] });
  });

  test("array test", () => {
    const testArray: $ReadOnlyArray<string> = ["test1", "test2"];
    let test = array.join(testArray, ",");
    let testShouldEqual: Array<string> = ["test1", ",", "test2"];
    expect(test).toEqual(testShouldEqual);
  });
});
