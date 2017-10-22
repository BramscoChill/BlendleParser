import React, { PureComponent } from 'react';
import { bool, string } from 'prop-types';
import BlendleLoading from 'components/LoadingLogo';
import Loading from 'components/Loading';
import isDeeplink from '../../helpers/isDeeplink';
import CSS from './style.scss';

class ItemLoading extends PureComponent {
  static propTypes = {
    isLoading: bool,
    itemId: string.isRequired,
  };

  state = {
    showBlendleLoader: isDeeplink(this.props.itemId),
  };

  componentDidMount() {
    if (this.state.showBlendleLoader) {
      // When a user visits deeplink, they see the blendle logo animate for one second.
      // After that animation is done, replace the blendle loader with the regular loader.
      this._blendleLoaderTimeout = setTimeout(() => {
        this.setState({ showBlendleLoader: false });
      }, 1000);
    }
  }

  componentWillUnmount() {
    clearTimeout(this._blendleLoaderTimeout);
  }

  render() {
    const { isLoading } = this.props;
    const { showBlendleLoader } = this.state;

    if (!isLoading && !showBlendleLoader) {
      return null;
    }

    return (
      <div className={CSS.loading} data-test-identifier="item-loader">
        {showBlendleLoader ? (
          <BlendleLoading className={CSS.blendleLoader} />
        ) : (
          <Loading className={CSS.loadingIcon} />
        )}
      </div>
    );
  }
}

export default ItemLoading;



// WEBPACK FOOTER //
// ./src/js/app/modules/item/components/ItemLoading/index.js