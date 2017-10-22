import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { node, shape } from 'prop-types';
import URI from 'urijs';
import { sanitize } from 'dompurify';
import Link from 'components/Link';

function getHref(uri) {
  const hostname = uri.hostname();
  // If this a link to a blendle.com website, we only return the path. That way, the links to
  // blendle.com work on development.blendle.com and localhost too
  if (hostname === window.location.hostname || hostname === 'blendle.com') {
    return uri.path();
  }

  return uri.toString();
}

export default class HTMLWithLinks extends Component {
  static propTypes = {
    children: node,
    linkProps: shape(Link.propTypes),
  };

  static defaultProps = {
    children: null,
    linkProps: {},
  };

  componentDidMount() {
    this.replaceAnchorTags();
  }

  componentDidUpdate(previousProps) {
    if (previousProps.children !== this.props.children) {
      this.replaceAnchorTags();
    }
  }

  replaceAnchorTags() {
    const anchors = Array.from(this.el.querySelectorAll('a'));

    const links = anchors.map(anchor => ({
      uri: new URI(anchor.href),
      children: sanitize(anchor.innerHTML),
    }));

    // Insert Link components
    anchors.forEach((anchor, index) => {
      const span = document.createElement('span');
      anchor.parentNode.insertBefore(span, anchor);
      const { uri, children } = links[index];

      ReactDOM.render(
        <Link
          href={getHref(uri)}
          dangerouslySetInnerHTML={{ __html: children }}
          {...this.props.linkProps}
        />,
        span,
      );
    });

    // Remove original anchor elements
    anchors.forEach((anchor) => {
      anchor.parentNode.removeChild(anchor);
    });
  }

  render() {
    const { children, linkProps, ...props } = this.props;

    return (
      <div
        dangerouslySetInnerHTML={{ __html: sanitize(children) }}
        ref={el => (this.el = el)}
        {...props}
      />
    );
  }
}



// WEBPACK FOOTER //
// ./src/js/app/components/HTMLWithLinks.js