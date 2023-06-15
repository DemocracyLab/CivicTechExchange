// @flow

import React from "react";
import ModalWrapper, { ModalSizes } from "../ModalWrapper.jsx";
import VideoWrapper from "./VideoWrapper.jsx";

type Props = {|
  showModal: boolean,
  videoUrl: string,
  videoTitle: string,
  onClose: () => void,
|};
type State = {|
  showModal: boolean,
|};

/**
 * Modal for showing videos
 */
class VideoModal extends React.PureComponent<Props, State> {
  constructor(props: Props): void {
    super(props);
    this.state = {
      showModal: false,
    };
  }

  static getDerivedStateFromProps(nextProps: Props, state){
    return { showModal: nextProps.showModal };
  }

  render(): React$Node {
    return (
      <ModalWrapper
        showModal={this.state.showModal}
        headerText={this.props.videoTitle}
        onClickCancel={this.props.onClose}
        hideButtons={true}
        size={ModalSizes.ExtraLarge}
      >
        <VideoWrapper videoUrl={this.props.videoUrl} />
      </ModalWrapper>
    );
  }
}

export default VideoModal;
