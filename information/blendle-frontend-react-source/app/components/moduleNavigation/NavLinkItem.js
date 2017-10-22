import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Link from 'components/Link';
import ModuleNavigationStore from 'stores/ModuleNavigationStore';

class NavLinkItem extends React.Component {
  static propTypes = {
    item: PropTypes.object.isRequired,
    onActiveChange: PropTypes.func,
    isActive: PropTypes.bool,
  };

  componentDidMount() {
    ModuleNavigationStore.listen(this._onStoreState);
    this._onStoreState(ModuleNavigationStore.getState());
  }

  componentDidUpdate(prevProps) {
    if (prevProps.item.url !== this.props.item.url) {
      this._onStoreState(ModuleNavigationStore.getState());
    }
  }

  componentWillUnmount() {
    ModuleNavigationStore.unlisten(this._onStoreState);
  }

  _onStoreState = (storeState) => {
    const isActive = this._isActive(storeState.activeUrl);
    if (this.state.isActive !== isActive) {
      this.props.onActiveChange && this.props.onActiveChange(isActive);
      this.setState({ isActive });
    }
  };

  _isActive = activeUrl => activeUrl === this._getHref();

  _getHref = () => {
    if (typeof this.props.item.url === 'string') {
      return `/${this.props.item.url}`;
    }
    return null;
  };

  state = {
    isActive: this._isActive(ModuleNavigationStore.getState().activeUrl),
  };

  render() {
    // eslint-disable-next-line no-unused-vars
    const { item, isActive, onActiveChange, ...others } = this.props;
    const linkClassName = classNames({
      [item.className]: item.className,
      's-active': isActive || this.state.isActive,
      's-loading': item.loading,
      'l-animate': item.animate,
    });

    return (
      <li {...others}>
        <Link
          href={this._getHref()}
          aliases={item.aliases}
          onClick={item.onClick}
          className={linkClassName}
        >
          {item.label}
        </Link>
      </li>
    );
  }
}

export default NavLinkItem;



// WEBPACK FOOTER //
// ./src/js/app/components/moduleNavigation/NavLinkItem.js