// @flow

import React from "react";

type Props = {|
  isClicked: boolean,
  onClick?: (event: SyntheticEvent<HTMLButtonElement>) => void,
|};

/**
 * VARSubmitButton - Form submission button with visual state feedback
 * Shows orange button with regular text when not clicked
 * Shows gray button with bold text when clicked
 */
function VARSubmitButton(props: Props): React$Node {
  const { isClicked, onClick } = props;
  
  const buttonClass = `var-submit-button ${
    isClicked ? "var-submit-button--clicked" : ""
  }`.trim();

  return (
    <button
      type="submit"
      className={buttonClass}
      onClick={onClick}
    >
      Submit
    </button>
  );
}

export default VARSubmitButton;
