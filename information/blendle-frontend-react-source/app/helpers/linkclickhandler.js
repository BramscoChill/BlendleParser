import { history } from 'byebye';
import getSelfOrParent from 'helpers/getselforparent';
import URI from 'urijs';

function isExternalLink(href) {
  return href.match(/^(mailto|http|https):/i);
}

// Check if we can and should handle a click on this target.
function shouldHandleLink(target) {
  const href = target.getAttribute('href');
  const ignore = target.getAttribute('data-ignoreclickhandler');
  return !ignore && href && !href.startsWith('#') && !isExternalLink(href);
}

function absoluteHref(href) {
  return new URI(href).absoluteTo(window.location.pathname).toString();
}

function listener(e) {
  // Search for <a> up the tree
  // delegateTarget is an exoskeleton thing, sometimes mising.
  const target = getSelfOrParent(e.delegateTarget || e.target, 'a');
  if (target && shouldHandleLink(target)) {
    if (!e.defaultPrevented) {
      const href = absoluteHref(target.getAttribute('href'));
      history.navigate(href, { trigger: true });

      e.preventDefault();
    }
  }
}

document.addEventListener('click', listener, false);



// WEBPACK FOOTER //
// ./src/js/app/helpers/linkclickhandler.js