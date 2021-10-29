// @flow

import React from "react";
import VideoWrapper from "../common/video/VideoWrapper.jsx";

type State = {|
  videoUrl: string,
|};

// Shows embedded video
class VideoController extends React.PureComponent<{||}, State> {
  constructor(): void {
    super();
    this.state = { videoUrl: window.YOUTUBE_VIDEO_URL };
  }

  render(): React$Node {
    return <VideoWrapper videoUrl={this.state.videoUrl} />;
  }
}

export default VideoController;
