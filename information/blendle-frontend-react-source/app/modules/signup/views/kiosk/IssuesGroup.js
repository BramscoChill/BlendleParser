const React = require('react');
const ReactDOM = require('react-dom');
const Analytics = require('instances/analytics');
const BrowserEnv = require('instances/browser_environment');
const i18n = require('instances/i18n');
const formMixin = require('../mixins/formMixin');
const classNames = require('classnames');

class IssuesGroup extends React.Component {
  state = {
    open: false,
    more: false,
    maxHeight: null,
  };

  componentDidMount() {
    if (this.props.full) return;

    const issuesContainer = ReactDOM.findDOMNode(this.refs.issues);

    if (issuesContainer.scrollHeight > issuesContainer.offsetHeight) {
      this.setState({ more: true });
    }
  }

  componentDidUpdate() {
    if (this.props.full) return;

    // trigger reflow on android 4 browser to fix the overflow: scroll issue
    // teribble fix, but the Android 4 browser is the new IE6
    if (BrowserEnv.isAndroidBrowser()) {
      const pane = document.querySelector('.pane-cur');
      setTimeout(() => {
        if (pane) {
          pane.style.height = `${window.innerHeight}px`;
          setTimeout(() => {
            pane.style.height = '';
          }, 16);
        }
      }, 500);
    }
  }

  render() {
    const className = classNames(
      'v-issues-group',
      this.props.className,
      { 's-open': this.state.open },
      { 'l-full': this.props.full },
    );

    const styles = {};
    if (this.state.maxHeight) {
      styles.maxHeight = this.state.maxHeight;
    }

    let toggleLink;
    if (!this.props.full && this.state.more) {
      const type = this.state.open === true ? 'collapse' : 'expand';
      toggleLink = (
        <a className="lnk-toggle" onClick={this._toggleOpen}>
          {i18n.translate(`signup.kiosk.issues.${type}`)}
        </a>
      );
    }

    let title;
    if (this.props.title) {
      title = <h3>{this.props.title}</h3>;
    }

    return (
      <div className={className}>
        {title}
        <ul ref="issues" className="issues" style={styles}>
          {this.props.children}
        </ul>
        {toggleLink}
      </div>
    );
  }

  _toggleOpen = () => {
    const maxHeight = !this.state.open ? ReactDOM.findDOMNode(this.refs.issues).scrollHeight : null;

    this.setState({
      open: !this.state.open,
      maxHeight,
    });
  };
}

module.exports = IssuesGroup;



// WEBPACK FOOTER //
// ./src/js/app/modules/signup/views/kiosk/IssuesGroup.js