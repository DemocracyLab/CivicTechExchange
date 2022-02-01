// @flow

import React, { useState } from "react";
import { usePopper } from "react-popper";
import type { Dictionary } from "../../types/Generics.jsx";

type Props = {|
  show: boolean,
  source: React$Node,
  frame: React$Node,
  onHide: () => void,
|};

const PopOut = (props: Props) => {
  const [referenceElement, setReferenceElement] = useState(null);
  const [popperElement, setPopperElement] = useState(null);
  const [arrowElement, setArrowElement] = useState(null);
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: "auto-end",
    strategy: "fixed",
    modifiers: [{ name: "arrow", options: { element: arrowElement } }],
  });

  return (
    <React.Fragment>
      <div ref={setReferenceElement}>{props.source}</div>

      {props.show && (
        <div
          ref={setPopperElement}
          style={styles.popper}
          {...attributes.popper}
        >
          <div className="popout-frame">{props.frame}</div>
          <div ref={setArrowElement} style={styles.arrow} />
        </div>
      )}
    </React.Fragment>
  );
};

export default PopOut;