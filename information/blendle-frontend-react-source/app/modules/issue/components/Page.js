import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Image from 'components/Image';
import BrowserEnvironment from 'instances/browser_environment';
import PageItem from 'modules/issue/components/PageItem';

class Page extends PureComponent {
  static propTypes = {
    items: PropTypes.array.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    preview: PropTypes.string.isRequired,
  };

  _renderItems() {
    return this.props.items.map(item => (
      <PageItem itemId={item.id} regions={item.regions} key={item.id} />
    ));
  }

  render() {
    const { preview, width, height } = this.props;

    return (
      <div className="v-page">
        <Image
          animate={BrowserEnvironment.isDesktop()}
          src={preview}
          width={width}
          height={height}
        />
        {this._renderItems()}
      </div>
    );
  }
}

export default Page;



// WEBPACK FOOTER //
// ./src/js/app/modules/issue/components/Page.js