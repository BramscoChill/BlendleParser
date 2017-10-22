import React from 'react';
import PropTypes from 'prop-types';
import Img from 'components/Image';
import { prefillSelector, providerById } from 'selectors/providers';
import classNames from 'classnames';

class SelectableIssue extends React.Component {
  static propTypes = {
    issue: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    height: PropTypes.oneOf([115, 180]),
    selected: PropTypes.bool,
    disabled: PropTypes.bool,
    className: PropTypes.string,
  };

  render() {
    if (!this.props.issue.get) {
      return null;
    }

    const cover =
      this.props.issue._links.cover_image ||
      this.props.issue._links.page_preview ||
      (this.props.issue.get('_links') ? this.props.issue.get('_links').page_preview : undefined);

    if (!cover) {
      return null;
    }

    const width = this.props.height / cover.height * cover.width;

    const style = {
      width: Math.ceil(width),
      height: Math.ceil(this.props.height),
    };

    const manifest = this.props.issue.get('manifest');
    const providerId = manifest ? manifest.get('provider').id : this.props.issue.get('provider').id;
    const providerName = prefillSelector(providerById)(providerId).name;

    const classes = classNames('selectable-issue', {
      [this.props.className]: this.props.className,
    });

    const labelClasses = classNames(
      'v-selectable-issue',
      { selected: this.props.selected },
      { small: this.props.height === 115 },
    );

    return (
      <div className={classes}>
        <label aria-label={providerName} className={labelClasses} style={style}>
          <input
            type="checkbox"
            onChange={this.props.onChange}
            disabled={this.props.disabled}
            checked={this.props.selected}
          />
          <Img src={cover.href} alt={providerName} width={width} height={this.props.height} />
        </label>
      </div>
    );
  }
}

export default SelectableIssue;



// WEBPACK FOOTER //
// ./src/js/app/modules/signup/views/kiosk/SelectableIssue.js