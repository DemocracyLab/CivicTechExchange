import validationHelper, { FormFieldValidator } from "../utils/validation.js";

const testValidators: $ReadOnlyArray<FormFieldValidator> = [
  {
    fieldName: "truthyField",
    checkFunc: form => !!form.truthyField,
    errorMessage: "This field should be truthy",
  },
  {
    fieldName: "blankField",
    checkFunc: form => form.blankField === "",
    errorMessage: form =>
      "This field should be blank, but it is " + form.blankField,
  },
];

const fineFormFields = { truthyField: 1, blankField: "" };
const badFormFields = { truthyField: 0, blankField: "not blank!" };

describe("validationHelper", () => {
  test("getErrorMessage", () => {
    expect(
      validationHelper.getErrorMessage(testValidators[0], badFormFields)
    ).toEqual("This field should be truthy");
    expect(
      validationHelper.getErrorMessage(testValidators[1], badFormFields)
    ).toEqual("This field should be blank, but it is not blank!");
  });

  test("getErrors", () => {
    const fineResults = validationHelper.getErrors(
      testValidators,
      fineFormFields
    );
    const badResults = validationHelper.getErrors(
      testValidators,
      badFormFields
    );
    expect(fineResults).toEqual({});
    expect(badResults).toEqual({
      truthyField: "This field should be truthy",
      blankField: "This field should be blank, but it is not blank!",
    });
  });
});
