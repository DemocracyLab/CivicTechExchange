// @flow

import React, { useState } from "react";
import { usePopper } from "react-popper";
import ClickOutFrame from "./ClickOutFrame.jsx";

type Props = {|
  show: boolean,
  source: React$Node,
  frame: React$Node,
  onHide: () => void,
|};

const PopOut = (props: Props) => {
  const [referenceElement, setReferenceElement] = useState(null);
  const [popperElement, setPopperElement] = useState(null);
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: "bottom",
  });

  return (
    <React.Fragment>
      <div className="PopOut-source" ref={setReferenceElement}>
        {props.source}
      </div>

      {props.show && (
        <React.Fragment>
          <ClickOutFrame onClickOut={props.onHide} />
          <div
            className="PopOut-container"
            ref={setPopperElement}
            style={styles.popper}
            {...attributes.popper}
          >
            {props.frame}
          </div>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default PopOut;
