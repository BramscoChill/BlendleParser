import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TilePane from 'components/TilePane';
import PageTile from 'components/tiles/PageTile';
import Measure from 'react-measure';
import BrowserEnvironment from 'instances/browser_environment';
import PopularInIssueTile from 'components/tiles/PopularInIssueTile';
import IssueAcquisitionContainer from 'modules/issue/containers/IssueAcquisitionContainer';

class PagesIssue extends Component {
  static propTypes = {
    issue: PropTypes.object,
    onScroll: PropTypes.func.isRequired,
    onNearEnd: PropTypes.func.isRequired,
    onEnd: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    navigateToSectionIndex: PropTypes.number.isRequired,
    disabled: PropTypes.bool.isRequired,
    mobileNavigation: PropTypes.any.isRequired,
    pages: PropTypes.array.isRequired,
    popularItems: PropTypes.array.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      paneHeight: null,
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.navigateToSectionIndex !== this.props.navigateToSectionIndex) {
      this._list.scrollTo(this.props.navigateToSectionIndex, true);
    }
  }

  _onMeasure = ({ height }) => {
    if (height > 0) {
      this.setState({
        paneHeight: height,
      });
    }
  };

  _renderPopular() {
    return (
      <PopularInIssueTile
        key={`popular-in-issue-${this.props.issue.id}`}
        providerId={this.props.issue.get('provider').id}
        items={this.props.popularItems}
        issue={this.props.issue}
      />
    );
  }

  _renderArticles() {
    const { pages, issue } = this.props;

    return pages.map((page, index) => <PageTile key={`${issue.id}_page_${index}`} page={page} />);
  }

  _renderTiles() {
    if (this.props.loading || this.state.paneHeight === null) {
      return null;
    }

    return [this._renderPopular(), ...this._renderArticles()];
  }

  _renderMobileNavigation() {
    if (BrowserEnvironment.isMobile()) {
      return this.props.mobileNavigation;
    }

    return null;
  }

  render() {
    return (
      <div>
        <Measure onMeasure={this._onMeasure} whitelist={['height']}>
          <TilePane
            ref={(c) => {
              this._list = c;
            }} // eslint-disable-line brace-style
            showButtons={!!BrowserEnvironment.isDesktop()}
            active={!this.props.disabled}
            loading={this.props.loading}
            orientation={'horizontal'}
            initialIndex={this.props.navigateToSectionIndex}
            onEnd={this.props.onEnd}
            onNearEnd={this.props.onNearEnd}
            onScroll={this.props.onScroll}
          >
            {BrowserEnvironment.isMobile() ? (
              <IssueAcquisitionContainer issue={this.props.issue} />
            ) : (
              undefined
            )}
            {this._renderMobileNavigation()}
            {this._renderTiles()}
          </TilePane>
        </Measure>
        {!BrowserEnvironment.isMobile() ? (
          <IssueAcquisitionContainer issue={this.props.issue} />
        ) : (
          undefined
        )}
      </div>
    );
  }
}

export default PagesIssue;



// WEBPACK FOOTER //
// ./src/js/app/modules/issue/components/PagesIssue.js