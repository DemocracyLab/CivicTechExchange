// @flow

import React from "react";

type Props = {|
  className?: string,
|};

/**
 * VARFormDivider - Visual separator between form sections
 * Simple horizontal divider line for VAR forms
 * Desktop: lighter border (#BDBDBD)
 * Mobile: darker border (#828282)
 */
function VARFormDivider(props: Props): React$Node {
  const className = `var-form-divider ${props.className || ""}`.trim();
  
  return <hr className={className} />;
}

export default VARFormDivider;
