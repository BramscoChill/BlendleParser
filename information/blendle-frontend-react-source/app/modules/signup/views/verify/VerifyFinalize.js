const React = require('react');
const PropTypes = require('prop-types');
const ReactDOM = require('react-dom');
const Translate = require('components/shared/Translate');
const i18n = require('instances/i18n').locale;
const AvatarImage = require('components/AvatarImage');
const classNames = require('classnames');
import { STATUS_ERROR, STATUS_OK } from 'app-constants';

// Uses React portal pattern to create element outside
// virtual DOM structure and unmount after a timeout
// /
// See React Portals: http://joecritchley.svbtle.com/portals-in-reactjs

class VerifyFinalize extends React.Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
    disabled: PropTypes.bool,
    verified: PropTypes.string,
    onFinalized: PropTypes.func.isRequired,
  };

  _closeAnimation = false;
  _finalized = false;

  onSubmit = (ev) => {
    ev.preventDefault();
    this.props.onSubmit();
  };

  invokeFinalizeOnce = () => {
    if (this._finalized) {
      return;
    }

    if (this.props.verified === STATUS_OK) {
      this._finalized = true;
      this.props.onFinalized();
    }
  };

  componentDidMount() {
    this._target = document.createElement('div');
    document.querySelector('#app').appendChild(this._target);

    if (this.props.disabled) {
      return;
    }

    this.invokeFinalizeOnce();
    this._renderLayer();
  }

  componentDidUpdate() {
    if (this.props.disabled) {
      return;
    }

    this.invokeFinalizeOnce();
    this._renderLayer();
  }

  componentWillUnmount() {
    document.body.classList.add('pane-verified-animation');

    this._closeAnimation = true;

    this._renderLayer();

    setTimeout(() => {
      ReactDOM.unmountComponentAtNode(this._target);
      document.querySelector('#app').removeChild(this._target);

      document.body.classList.remove('pane-verified-animation');
    }, 1000);
  }

  render() {
    return <div />;
  }

  _renderLayer = () => {
    ReactDOM.render(this.renderLayer(), this._target);
  };

  renderLayer = () => {
    const className = classNames({
      'v-verify-finalize': true,
      'close-animation': this._closeAnimation,
    });

    if (this.props.hidden) {
      return <div />;
    }

    const style = {
      zIndex: 15000,
    };

    if (this.props.verified === STATUS_ERROR || !this.props.user) {
      return (
        <div className={className} style={style}>
          <div className="verify-content">
            <Translate find="signup.verifyFinalize.failed" sanitize={false} />
            <p>
              <a href="/" className="btn" onClick={this._close}>
                {i18n.app.buttons.close}
              </a>
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className={className} style={style}>
        <div className="verify-content s-loading" />
      </div>
    );
  };

  _close = (ev) => {
    ev.preventDefault();
    // hard reset
    window.location = '/';
  };
}

module.exports = VerifyFinalize;



// WEBPACK FOOTER //
// ./src/js/app/modules/signup/views/verify/VerifyFinalize.js