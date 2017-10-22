import React from 'react';
import PropTypes from 'prop-types';
import Tile from 'components/Tile';
import Button from 'components/Button';
import Link from 'components/Link';
import { translateElement, translate } from 'instances/i18n';

class ExplainFollowingTile extends React.Component {
  static propTypes = {
    twitterConnected: PropTypes.bool.isRequired,
    facebookConnected: PropTypes.bool.isRequired,
    onHide: PropTypes.func.isRequired,
  };

  _renderFacebookButton = () => {
    if (!this.props.facebookConnected) {
      return (
        <Link href="/social/facebook" className="btn btn-facebook">
          {translate('social.facebook.button')}
        </Link>
      );
    }
  };

  _renderTwitterButton = () => {
    if (!this.props.twitterConnected) {
      return (
        <Link href="/social/twitter" className="btn btn-twitter">
          {translate('social.twitter.button')}
        </Link>
      );
    }
  };

  _renderSocial = () => {
    if (!this.props.twitterConnected || !this.props.facebookConnected) {
      return (
        <div className="explain-social">
          {this._renderFacebookButton()}
          {this._renderTwitterButton()}
        </div>
      );
    }

    return null;
  };

  _renderDismissButton = () => {
    if (!this.props.twitterConnected || !this.props.facebookConnected) {
      return (
        <a
          className="lnk-later"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            this.props.onHide();
          }}
        >
          {translate('explain.social.later')}
        </a>
      );
    }

    return (
      <Button className="btn-explain-okay" onClick={this.props.onHide}>
        {translate('app.buttons.i_get_it')}
      </Button>
    );
  };

  render() {
    return (
      <Tile type="explain-following">
        <div className="tile-explain">
          <div className="explanation">
            {translateElement(<h2 />, 'timeline.explain.following.explanation')}
          </div>
          {this._renderSocial()}
          {this._renderDismissButton()}
        </div>
      </Tile>
    );
  }
}

export default ExplainFollowingTile;



// WEBPACK FOOTER //
// ./src/js/app/components/tiles/ExplainFollowingTile.js