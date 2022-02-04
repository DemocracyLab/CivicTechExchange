// @flow

import React from "react";

type Props = {|
  onClickOut: () => void,
|};

const ClickOutFrame = (props: Props) => {
  return <div className="clickout-frame" onClick={props.onClickOut} />;
};

export default ClickOutFrame;
