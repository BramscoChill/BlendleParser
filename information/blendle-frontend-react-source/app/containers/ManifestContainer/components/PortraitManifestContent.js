import React from 'react';
import PropTypes from 'prop-types';
import Link from 'components/Link';
import classNames from 'classnames';
import stripTags from 'underscore.string/stripTags';

const MANIFEST_TYPE = 'manifest-rectangle-portrait-image';

class PortraitManifestContent extends React.Component {
  static propTypes = {
    portraitImage: PropTypes.object.isRequired,
    itemURI: PropTypes.string.isRequired,
    onOpen: PropTypes.func.isRequired,
    itemContent: PropTypes.arrayOf(PropTypes.element).isRequired,
    analytics: PropTypes.object.isRequired,
    setRenderedType: PropTypes.func,
    className: PropTypes.string,
  };

  componentWillMount() {
    if (this.props.setRenderedType) {
      this.props.setRenderedType(MANIFEST_TYPE);
    }

    const tags = this.props.analytics.tags || [];
    this.analytics = {
      ...this.props.analytics,
      tags: [...tags, MANIFEST_TYPE],
    };
  }

  _renderItemContent() {
    return <div className="item-excerpt">{this.props.itemContent}</div>;
  }

  _renderImageCredits() {
    const credit = this.props.portraitImage.credit;
    if (!credit) {
      return null;
    }

    return <div className="credits">{stripTags(credit)}</div>;
  }

  render() {
    const className = classNames(this.props.className, 'manifest-content', 'portrait-image-tile');
    const style = {
      backgroundImage: `url(${this.props.portraitImage.href})`,
    };

    return (
      <Link
        href={this.props.itemURI}
        onClick={this.props.onOpen}
        analytics={this.analytics}
        className={className}
        style={style}
      >
        {this._renderImageCredits()}
        <div className="body">{this._renderItemContent()}</div>
      </Link>
    );
  }
}

export default PortraitManifestContent;



// WEBPACK FOOTER //
// ./src/js/app/containers/ManifestContainer/components/PortraitManifestContent.js