import React from 'react';
import PropTypes from 'prop-types';
import Logo from 'components/Logo';
import Link from 'components/Link';
import { MAINTENANCE, NOT_FOUND } from 'app-constants';
import { translate, translateElement } from 'instances/i18n';
import CSS from './Error.scss';

function getTitle(type, title) {
  if (title) {
    return title;
  }
  if (type === NOT_FOUND) {
    return <span data-test-identifier="404-header">{translate('app.not_found.title')}</span>;
  }
  if (type === MAINTENANCE) {
    return "We'll be back shortly!";
  }
  return 'Something went wrong...';
}

function SubTitle({ type }) {
  switch (type) {
    case NOT_FOUND:
      try {
        return <h2 className={CSS.subTitle}>{translate('app.not_found.sub_title')}</h2>;
      } catch (e) {
        return null;
      }
    default:
      return null;
  }
}
SubTitle.propTypes = {
  type: PropTypes.oneOf([NOT_FOUND, MAINTENANCE]),
};

function getBody(type, message) {
  if (message) {
    return message;
  }
  if (type === NOT_FOUND) {
    return translateElement(<p className={CSS.body} />, 'app.not_found.body', false);
  }
  if (type === MAINTENANCE) {
    return <p className={CSS.body}>We're tinkering with our machinery at the moment.</p>;
  }
  return <p className={CSS.body}>Blendle could not be loaded. Please try again later.</p>;
}

const Error = ({ title, type, message }) => (
  <section data-test-identifier="app-error-state" className={CSS.container}>
    <img className={CSS.ninja} src="/img/illustrations/ninja.png" />
    <h1 className={CSS.title}>{getTitle(type, title)}</h1>
    <SubTitle type={type} />
    {getBody(type, message)}
    <Link href="/">
      <Logo className={CSS.logo} />
    </Link>
  </section>
);

Error.propTypes = {
  title: PropTypes.string,
  type: PropTypes.string,
  message: PropTypes.any,
};

export default Error;



// WEBPACK FOOTER //
// ./src/js/app/components/Application/Error.js