// @flow

import React from "react";

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
    return (
      <div className="youtube-video-container">
        <iframe
          width="560"
          height="315"
          src={this.state.videoUrl}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    );
  }
}

export default VideoController;
