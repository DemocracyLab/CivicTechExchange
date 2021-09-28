// @flow

import React from "react";

type Props = {|
  videoUrl: string,
|};

// Shows embedded video
class VideoController extends React.PureComponent<Props> {
  constructor(): void {
    super();
  }

  render(): React$Node {
    return (
      <div className="youtube-video-container">
        <iframe
          width="560"
          height="315"
          src={this.props.videoUrl}
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
