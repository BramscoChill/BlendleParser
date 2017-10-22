import React, { PropTypes, PureComponent } from 'react';
import VolumeIcon from 'components/icons/Volume';
import { status as statusPropType } from 'libs/propTypes';
import { STATUS_PENDING, STATUS_ERROR } from 'app-constants';
import classNames from 'classnames';
import Controls from './Controls';
import CSS from './style.scss';

class ItemToSpeech extends PureComponent {
  static propTypes = {
    onClick: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    isActive: PropTypes.bool,
    status: statusPropType,
    url: PropTypes.string,
  };

  state = {
    isPlaying: false,
    totalSeconds: 0,
    playedSeconds: 0,
  };

  componentDidMount() {
    this._audioElement.addEventListener('loadedmetadata', this._onMetadataLoaded);
    this._audioElement.addEventListener('timeupdate', this._onTimeUpdate);
    this._audioElement.addEventListener('canplay', this._onCanPlay);
    this._audioElement.addEventListener('play', this._onPlay);
    this._audioElement.addEventListener('pause', this._onPause);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.isActive && !this.props.isActive) {
      this._audioElement.pause();
    }
  }

  componentWillUnmount() {
    this._audioElement.removeEventListener('loadedmetadata', this._onMetadataLoaded);
    this._audioElement.removeEventListener('timeupdate', this._onTimeUpdate);
    this._audioElement.removeEventListener('canplay', this._onCanPlay);
    this._audioElement.removeEventListener('play', this._onPlay);
    this._audioElement.removeEventListener('pause', this._onPause);
  }

  _onPlay = () => {
    this.setState({ isPlaying: true });
  };

  _onPause = () => {
    this.setState({ isPlaying: false });
  };

  _onTogglePlaying = () => {
    if (this._audioElement.paused) {
      this._audioElement.play();
    } else {
      this._audioElement.pause();
    }
  };
  _onMetadataLoaded = () => {
    this.setState({
      totalSeconds: Math.floor(this._audioElement.duration),
    });
  };

  _onCanPlay = () => {
    if (this.props.isActive) {
      this._audioElement.play();
    }
  };

  _onTimeUpdate = (e) => {
    this.setState({
      playedSeconds: Math.floor(e.target.currentTime),
    });
  };

  _onSeek = (e) => {
    const totalSeconds = this.state.totalSeconds;
    const seekPercentage = e.target.value;
    const nextSeconds = Math.round(totalSeconds * (seekPercentage / 100));

    this._audioElement.currentTime = nextSeconds;
  };

  render() {
    const { url, onClick, isActive, status, title } = this.props;

    const { totalSeconds, playedSeconds } = this.state;

    const isError = status === STATUS_ERROR;
    const shouldRenderControls = isActive && !isError;

    return (
      <div className={CSS.wrapper}>
        <audio
          title={title}
          ref={(ref) => {
            this._audioElement = ref;
          }}
          src={url}
        />
        {shouldRenderControls && (
          <Controls
            isPlaying={this.state.isPlaying}
            totalSeconds={totalSeconds}
            playedSeconds={playedSeconds}
            onSeek={this._onSeek}
            onTogglePlaying={this._onTogglePlaying}
            isLoading={status === STATUS_PENDING}
          />
        )}
        <button
          onClick={onClick}
          className={classNames(CSS.itemToSpeechButton, { [CSS.error]: isError })}
        >
          <VolumeIcon className={CSS.icon} />
        </button>
      </div>
    );
  }
}

export default ItemToSpeech;



// WEBPACK FOOTER //
// ./src/js/app/modules/item/components/ItemToSpeech/index.js