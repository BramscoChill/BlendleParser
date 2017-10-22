import React from 'react';
import PropTypes from 'prop-types';
import Image from 'components/Image';
import classNames from 'classnames';

class IssueStack extends React.Component {
  static propTypes = {
    src: PropTypes.string,
    className: PropTypes.string,
  };

  _renderIssues = () => {
    const src = this.props.src;
    if (!src) {
      return null;
    }

    return [1, 2, 3].map(i => <Image key={i} src={src} className="ui-issue-stack-issue" />);
  };

  render() {
    const stackClassNames = classNames('ui-issue-stack', {
      [this.props.className]: this.props.className,
    });

    return <div className={stackClassNames}>{this._renderIssues()}</div>;
  }
}

export default IssueStack;



// WEBPACK FOOTER //
// ./src/js/app/components/IssueStack.js