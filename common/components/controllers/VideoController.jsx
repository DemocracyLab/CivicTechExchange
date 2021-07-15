// @flow

import React from "react";

// Shows embedded video
class VideoController extends React.PureComponent {
  constructor(): void {
    super();
  }

  render(): React$Node {
    return (
      <div className="youtube-video-container">
        <iframe
          width="560"
          height="315"
          src="https://www.youtube.com/embed/nvIUWtx-nmo"
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
