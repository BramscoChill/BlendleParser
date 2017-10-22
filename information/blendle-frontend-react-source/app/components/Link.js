import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ModuleNavigationStore from 'stores/ModuleNavigationStore';
import ModuleNavigationActions from 'actions/ModuleNavigationActions';
import browserHistory from 'react-router/lib/browserHistory';
import URI from 'urijs';

class Link extends React.Component {
  static propTypes = {
    onClick: PropTypes.func,
    href: PropTypes.string,
    target: PropTypes.string,
    aliases: PropTypes.array,
    className: PropTypes.string,
    children: PropTypes.any,
    analytics: PropTypes.object,
    state: PropTypes.object,
  };

  static defaultProps = {
    href: null,
  };

  componentDidMount() {
    ModuleNavigationStore.listen(this._setActiveState);
  }

  componentWillUnmount() {
    ModuleNavigationStore.unlisten(this._setActiveState);
  }

  _isActive = () => {
    const activeUrl = ModuleNavigationStore.getState().activeUrl;
    if (activeUrl === this.props.href) {
      return true;
    }

    if (this.props.aliases && this.props.aliases.indexOf(activeUrl) > -1) {
      return true;
    }

    return false;
  };

  _isModifiedEvent = event => !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);

  _isLeftClickEvent = event => event.button === 0;

  _onClick = (e) => {
    const { href, target, analytics, state, onClick } = this.props;
    if (onClick) {
      onClick(e);
    }

    if (
      this._isModifiedEvent(e) ||
      !this._isLeftClickEvent(e) ||
      href === null ||
      e.defaultPrevented
    ) {
      return;
    }

    e.preventDefault();

    if (href.substr(0, 4) === 'http') {
      const Analytics = require('instances/analytics');
      Analytics.track('External href', {
        href,
        ...analytics,
      });

      if (target) {
        window.open(href, target);
      } else {
        window.location = href;
      }
    } else {
      if (target) {
        window.open(href, target);
        return;
      }

      const uri = new URI(href);

      setTimeout(() => {
        ModuleNavigationActions.setAnalytics(uri.path(), analytics);
        // We store the activeUrl in the ModuleNavigationStore with a leading slash
        ModuleNavigationActions.setAnalytics(`/${uri.path()}`, analytics);
        ModuleNavigationActions.setAnalytics(href, analytics);
        browserHistory.push({
          pathname: uri.path(),
          query: uri.query(true),
          hash: uri.hash(),
          state,
        });
      });
    }
  };

  _setActiveState = () => {
    this.setState({
      active: this._isActive(),
    });
  };

  state = {
    active: this._isActive(),
  };

  render() {
    // eslint-disable-next-line no-unused-vars
    const { analytics, aliases, children, state, ...others } = this.props;

    const className = classNames(this.props.className, { active: this.state.active });
    return (
      <a
        {...others}
        data-ignoreclickhandler
        className={className}
        onClick={this._onClick}
        rel="noopener"
      >
        {children}
      </a>
    );
  }
}

export default Link;



// WEBPACK FOOTER //
// ./src/js/app/components/Link.js