import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { STATUS_PENDING, STATUS_ERROR, STATUS_OK, VIEW_TIMELINE_DELAY } from 'app-constants';
import { applicationReady } from 'helpers/logPerformance';
import DelayedTrack from 'models/DelayedTrack';
import TimelineTiles from './TimelineTiles';

class Timeline extends PureComponent {
  static propTypes = {
    active: PropTypes.bool,
    profile: PropTypes.object, // user or channel profile model
    timeline: PropTypes.object,
    timelineStatus: PropTypes.number,
    items: PropTypes.array.isRequired,
    showExplainTile: PropTypes.bool.isRequired,
    onFetchNextItems: PropTypes.func,
    onHideExplainTile: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const { timeline } = this.props;

    this.viewTimelineEvent = new DelayedTrack(
      'View Timeline',
      {
        timeline: timeline.name,
        filter: timeline.options.details,
      },
      VIEW_TIMELINE_DELAY,
    );

    if (this.props.active) {
      this.viewTimelineEvent.startTimeout();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.active && !this.props.active) {
      this.viewTimelineEvent.startTimeout();
    }
  }

  componentDidUpdate() {
    if (this.props.timelineStatus === STATUS_OK) {
      applicationReady(`timeline/${this.props.timeline.name}`);
    }
  }

  componentWillUnmount() {
    this.viewTimelineEvent.cancelTimeout();
  }

  _renderTiles() {
    if (this.props.timelineStatus === STATUS_ERROR) {
      return <p>Something went wrong...</p>;
    }

    return (
      <TimelineTiles
        loading={this.props.timelineStatus === STATUS_PENDING}
        allowEmpty={this.props.timeline.name.startsWith('user')}
        timeline={this.props.timeline}
        items={this.props.items}
        profile={this.props.profile}
        active={this.props.active}
        onNearEnd={this.props.onFetchNextItems}
        showExplainTile={this.props.showExplainTile}
        onHideExplainTile={this.props.onHideExplainTile}
      />
    );
  }

  render() {
    return (
      <div className="v-module v-timeline v-module-content s-success">{this._renderTiles()}</div>
    );
  }
}

export default Timeline;



// WEBPACK FOOTER //
// ./src/js/app/modules/timeline/components/Timeline.js