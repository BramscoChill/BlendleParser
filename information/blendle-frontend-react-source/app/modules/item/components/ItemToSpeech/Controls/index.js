import React from 'react';
import { Slider } from '@blendle/lego';
import classNames from 'classnames';
import { padStart } from 'lodash';
import { number, bool, func } from 'prop-types';
import PlayIcon from 'components/icons/PlayIcon';
import PauseIcon from 'components/icons/PauseIcon';
import CSS from './style.scss';

function formatSeconds(time) {
  const mins = padStart(Math.floor(time / 60), 2, '0');
  const seconds = padStart(Math.floor(time % 60), 2, '0');

  return `${mins}:${seconds}`;
}

const ItemToSpeechControls = ({
  playedSeconds,
  totalSeconds,
  isPlaying,
  onTogglePlaying,
  onSeek,
  isLoading,
}) => {
  const playedPercentage =
    totalSeconds > 0 ? Math.round(playedSeconds / totalSeconds * 10000) / 100 : 0;

  return (
    <div className={classNames(CSS.itemToSpeechControls, isLoading && CSS.isLoading)}>
      <button className={CSS.toggleButton} onClick={onTogglePlaying}>
        {isPlaying ? <PauseIcon /> : <PlayIcon />}
      </button>
      <span className={CSS.time}>
        {formatSeconds(playedSeconds)} / {formatSeconds(totalSeconds)}
      </span>
      <div className={CSS.seekbar}>
        <Slider className={CSS.slider} value={playedPercentage} onChange={onSeek} />
      </div>
    </div>
  );
};

ItemToSpeechControls.propTypes = {
  isPlaying: bool,
  playedSeconds: number,
  totalSeconds: number,
  isLoading: bool,
  onTogglePlaying: func.isRequired,
  onSeek: func.isRequired,
};

ItemToSpeechControls.defaultProps = {
  playedSeconds: 0,
  totalSeconds: 0,
};

export default ItemToSpeechControls;



// WEBPACK FOOTER //
// ./src/js/app/modules/item/components/ItemToSpeech/Controls/index.js