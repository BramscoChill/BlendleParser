import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { param as urlParam } from 'helpers/url';
import { isMobileBreakpoint } from 'helpers/viewport';
import { maintainAspectRatio } from 'helpers/aspectRatio';
import CSS from './style.scss';

// Reference: https://developers.google.com/youtube/player_parameters
const playerSettings = {
  modestBranding: 1, // Hides the youtube logo in bottom right corner
  rel: 0, // Do not show related videos. Maybe we want this though?
};

const MAX_VIDEO_WIDTH = 1280;

function getIframeDimensions(video) {
  const desiredWidth = isMobileBreakpoint()
    ? window.innerWidth - 30 // 15px margin on both sides
    : window.innerWidth * 0.9; // 5% margin on both sides

  const { width, height } = video;
  const maxWidth = Math.min(desiredWidth, MAX_VIDEO_WIDTH);
  const maxHeight = window.innerHeight * 0.8;

  return maintainAspectRatio({
    width,
    height,
    maxWidth,
    maxHeight,
  });
}

// TODO: resize handlers to resize the iFrame (after Reader refactor)
class YoutubeVideo extends PureComponent {
  static propTypes = {
    video: PropTypes.object.isRequired,
  };

  render() {
    const { video } = this.props;

    const optionsParameters = urlParam(playerSettings);
    const url = `${video._links.file.href}?${optionsParameters}`;

    return (
      <div data-test-identifier="youtube-video-container" className={CSS.container}>
        <iframe className={CSS.video} src={url} {...getIframeDimensions(video)} />
      </div>
    );
  }
}

export default YoutubeVideo;



// WEBPACK FOOTER //
// ./src/js/app/modules/item/components/YoutubeVideo/index.js