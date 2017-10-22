import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { STATUS_ERROR, NOT_FOUND } from 'app-constants';
import { history } from 'byebye';
import Auth from 'controllers/auth';
import BrowserEnv from 'instances/browser_environment';
import TilePane from 'components/TilePane';
import Tile from 'components/Tile';
import ItemTile from 'components/tiles/ItemTile';
import ProfileTile from 'components/tiles/ProfileTile';
import NewsletterTile from 'components/tiles/NewsletterTile';
import Measure from 'react-measure';
import UpgradeAccount from 'components/UpgradeAccount';
import Error from 'components/Application/Error';
import Select from 'components/Select';
import { getTrendingFilters } from 'managers/timeline';
import ExplainFollowingTileContainer from 'components/tiles/ExplainFollowingTileContainer';
import NormalTileContainer from 'containers/NormalTileContainer';
import { getItemId } from 'selectors/item';
import NormalTileWrapper from './NormalTileWrapper';
import NoPins from './NoPins';

class TimelineTiles extends PureComponent {
  static propTypes = {
    active: PropTypes.bool,
    loading: PropTypes.bool,
    allowEmpty: PropTypes.bool,
    timeline: PropTypes.object.isRequired,
    items: PropTypes.any.isRequired,
    profile: PropTypes.object,
    onNearEnd: PropTypes.func,
    showExplainTile: PropTypes.bool.isRequired,
    onHideExplainTile: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this._analyticsCache = new Map();

    this.state = {
      paneHeight: null,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (
      this._tilepane &&
      (nextProps.timeline.name !== this.props.timeline.name &&
        nextProps.timeline.options.details !== this.props.timeline.options.details)
    ) {
      this._tilepane.scrollTo(0);
    }
  }

  componentWillUnmount() {
    this._analyticsCache = new Map();
  }

  _itemTileAnalytics(name, index) {
    const key = `${name}-${index}`;

    if (!this._analyticsCache.get(key)) {
      this._analyticsCache.set(key, {
        type: `timeline/${name}`,
        position: index,
      });
    }

    return this._analyticsCache.get(key);
  }

  _onNavigateTrending = (value) => {
    history.navigate(`trending/${value}`, { trigger: true });
  };

  _renderItemTile(item, index) {
    const { name } = this.props.timeline;

    if (name === 'pins') {
      return (
        <NormalTileWrapper>
          <NormalTileContainer
            itemId={getItemId(item)}
            tileHeight={this.state.paneHeight}
            key={`${name}-${getItemId(item)}`}
          />
        </NormalTileWrapper>
      );
    }

    return (
      <Tile type="item" key={`${name}-${getItemId(item)}`}>
        <ItemTile
          itemId={getItemId(item)}
          analytics={this._itemTileAnalytics(name, index)}
          toastDisabled={name === 'pins' || name === 'user'}
          tileHeight={this.state.paneHeight}
        />
      </Tile>
    );
  }

  _renderTrendingSelectTile() {
    const options = getTrendingFilters().map(({ trending, label }) => {
      const selected = trending === this.props.timeline.options.details;
      return (
        <option key={trending} value={trending} selected={selected}>
          {label}
        </option>
      );
    });

    return (
      <Tile type="select-trending" key="select-trending">
        <Select onChange={this._onNavigateTrending}>{options}</Select>
      </Tile>
    );
  }

  _renderExplainFollowingTile() {
    return <ExplainFollowingTileContainer key="explain" onHide={this.props.onHideExplainTile} />;
  }

  _renderUpgradeAccountTile() {
    return (
      <Tile type="upgrade-account" key="upgrade">
        <UpgradeAccount user={Auth.getUser()} timeline={this.props.timeline.name} />
      </Tile>
    );
  }

  _renderProfileTile() {
    if (!this.props.profile.data.id) {
      return null;
    }

    return (
      <Tile type="profile" key="profile">
        <ProfileTile profile={this.props.profile.data} />
      </Tile>
    );
  }

  _renderNewsletterTile() {
    return <NewsletterTile key="newsletter" />;
  }

  _renderTiles() {
    const timeline = this.props.timeline.name;
    const user = Auth.getUser();

    if (!this.state.paneHeight) {
      return null; // React-measure should always measure the pane height first
    }

    const tiles = this.props.items.map(this._renderItemTile.bind(this));

    // Add an profile tile
    if (this.props.profile) {
      tiles.splice(0, 0, this._renderProfileTile());
    }

    // On mobile, we want to show an dropdown tile on the trending timeline
    if (!this.props.loading && timeline === 'trending' && BrowserEnv.isMobile()) {
      tiles.splice(0, 0, this._renderTrendingSelectTile());
    }

    // Show 'Explanation tile' on position 0
    if (this.props.showExplainTile) {
      tiles.splice(0, 0, this._renderExplainFollowingTile());
    }

    // Show 'Upgrade Account' on position 6
    if (
      tiles.length > 6 &&
      timeline === 'following' &&
      user.get('orders') === 0 &&
      user.get('email_confirmed')
    ) {
      tiles.splice(6, 0, this._renderUpgradeAccountTile());
    }

    // If this is a 'newsletter signup' timeline, we should replace the channel-profile tile with
    // an explanation
    if (this.props.timeline.options.showStaffpicksExplanation) {
      tiles.splice(0, 1, this._renderNewsletterTile());
    }

    return tiles;
  }

  _renderEmpty() {
    if (this.props.timeline.name === 'pins') {
      return <NoPins />;
    }

    return <Error type={NOT_FOUND} />;
  }

  render() {
    if (this.props.profile && this.props.profile.status === STATUS_ERROR) {
      return this._renderEmpty();
    }

    if (!this.props.loading && (!this.props.items.length && !this.props.allowEmpty)) {
      return this._renderEmpty();
    }

    return (
      <Measure onMeasure={({ height }) => this.setState({ paneHeight: height })}>
        <TilePane
          ref={c => (this._tilepane = c)} // eslint-disable-line no-return-assign
          active={this.props.active}
          loading={this.props.loading}
          onNextItem={this._onNextItemScroll}
          onPrevItem={this._onPrevItemScroll}
          onNearEnd={this.props.onNearEnd}
          activeTimeline={this.props.timeline}
        >
          {this._renderTiles()}
        </TilePane>
      </Measure>
    );
  }
}

export default TimelineTiles;



// WEBPACK FOOTER //
// ./src/js/app/modules/timeline/components/TimelineTiles.js