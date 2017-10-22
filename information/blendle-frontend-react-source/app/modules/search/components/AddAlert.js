import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { STATUS_OK, STATUS_PENDING } from 'app-constants';
import { translate } from 'instances/i18n';

export default class AddAlertButton extends React.Component {
  static propTypes = {
    layout: PropTypes.oneOf(['button', 'link']),
    status: PropTypes.number.isRequired,
    onAdd: PropTypes.func.isRequired,
  };

  _onClick(ev) {
    ev.preventDefault();

    if (this.props.status !== STATUS_OK) {
      this.props.onAdd();
    }
  }

  _renderButton() {
    const className = classNames('btn btn-text btn-fullwidth btn-icon btn-secondary btn-alert', {
      's-loading': this.props.status === STATUS_PENDING,
      's-success': this.props.status === STATUS_OK,
    });

    return (
      <button type="button" className={className} onClick={this._onClick.bind(this)}>
        {translate('search.buttons.alert')}
      </button>
    );
  }

  _renderLink() {
    const className = classNames('add-alert', {
      's-loading': this.props.status === STATUS_PENDING,
      's-success': this.props.status === STATUS_OK,
    });

    return (
      <a
        className={className}
        onClick={this._onClick.bind(this)}
        title={translate('search.buttons.alert')}
      />
    );
  }

  render() {
    return this.props.layout === 'button' ? this._renderButton() : this._renderLink();
  }
}



// WEBPACK FOOTER //
// ./src/js/app/modules/search/components/AddAlert.js