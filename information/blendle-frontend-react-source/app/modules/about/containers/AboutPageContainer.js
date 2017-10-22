import React from 'react';
import PropTypes from 'prop-types';
import withRouter from 'react-router/lib/withRouter';
import Dialogue from 'components/dialogues/Dialogue';
import AboutMenu from '../components/AboutMenu';
import { getPrevious } from 'libs/byebye/history';

class AboutPageContainer extends React.Component {
  static propTypes = {
    router: PropTypes.object.isRequired,
    children: PropTypes.element.isRequired,
  };

  componentWillMount() {
    this._returnUrl = getPrevious() || '/';
    if (this._returnUrl.startsWith('/about')) {
      this._returnUrl = '/';
    }
  }

  _onClose() {
    this.props.router.push(this._returnUrl);
  }

  render() {
    return (
      <Dialogue className="dialogue-about" onClose={this._onClose.bind(this)}>
        <AboutMenu />
        {this.props.children}
      </Dialogue>
    );
  }
}

export default withRouter(AboutPageContainer);



// WEBPACK FOOTER //
// ./src/js/app/modules/about/containers/AboutPageContainer.js