import React, { Component } from 'react';
import { translate } from 'instances/i18n';
import PropTypes from 'prop-types';
import { JustifiedImageList } from '@blendle/lego';
import SelectableIssueContainer from 'modules/premiumSignup/containers/SelectableIssueContainer';
import DialogHeader from 'modules/premiumSignup/components/DialogHeader';
import DialogSubheader from 'modules/premiumSignup/components/DialogSubheader';
import { track, internalLocation } from 'helpers/premiumOnboardingEvents';
import Analytics from 'instances/analytics';
import Measure from 'react-measure';
import CSS from './Publications.scss';

function getColumns(width) {
  if (width < 400) {
    return 2;
  }

  if (width < 600) {
    return 3;
  }

  return 4;
}

const getProviderIds = image => image.issue.provider.id;

class Publications extends Component {
  static propTypes = {
    imageList: JustifiedImageList.propTypes.images,
    selected: PropTypes.array.isRequired,
    isOnboarding: PropTypes.bool,
    isDeeplinkSignUp: PropTypes.bool,
  };

  constructor(props) {
    super(props);

    this.state = {
      width: 0,
      hasSentBrowseEvent: false,
    };
  }

  componentDidMount() {
    const { imageList } = this.props;

    if (imageList.length) {
      const providerIds = imageList.map(getProviderIds);
      this._trackBrowseOnce(providerIds);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.imageList.length && nextProps.imageList.length) {
      const providerIds = nextProps.imageList.map(getProviderIds);
      this._trackBrowseOnce(providerIds);
    }
  }

  _trackBrowseOnce = (providerIds) => {
    // Only track browse events once per mount
    if (this.state.hasSentBrowseEvent) {
      return;
    }

    track(Analytics, 'Browse Publications', { provider_uids: providerIds });
    this.setState({ hasSentBrowseEvent: true });
  };

  _renderGrid() {
    const { imageList } = this.props;
    const containerWidth = this.state.width;
    const columns = getColumns(containerWidth);

    if (imageList.length === 0 || containerWidth === 0) {
      return null;
    }

    const analyticsPayload = {
      internal_location: internalLocation(window.location.pathname),
    };

    return (
      <JustifiedImageList
        columns={columns}
        images={imageList}
        gutter={16}
        containerWidth={containerWidth}
        imageRenderer={({ child, width, height }) => (
          <SelectableIssueContainer
            height={height}
            width={width}
            image={child.image.href}
            providerId={child.issue.provider.id}
            analyticsPayload={analyticsPayload}
          />
        )}
      />
    );
  }

  _renderTitle() {
    if (this.props.isDeeplinkSignUp) {
      return translate('preferences.publications.deeplink_title');
    }

    return translate('preferences.publications.title');
  }

  _renderSubtitle() {
    if (!this.props.isOnboarding) {
      return null; // Do not show subtitle when users come from preferences
    }

    if (this.props.isDeeplinkSignUp) {
      return translate('preferences.publications.deeplink_subtitle');
    }

    return translate('preferences.publications.subtitle');
  }

  render() {
    return (
      <div data-test-identifier="publicationsContainer">
        <DialogHeader className={CSS.header}>{this._renderTitle()}</DialogHeader>
        <DialogSubheader className={CSS.subheader}>{this._renderSubtitle()}</DialogSubheader>
        <Measure includeMargin={false} onMeasure={({ width }) => this.setState({ width })}>
          <div className={CSS.bodyContent}>{this._renderGrid()}</div>
        </Measure>
      </div>
    );
  }
}

export default Publications;



// WEBPACK FOOTER //
// ./src/js/app/modules/premiumSignup/components/Publications/index.js