import React from 'react';
import { translate } from 'instances/i18n';
import { node, bool } from 'prop-types';
import classNames from 'classnames';
import Link from 'components/Link';
import CSS from './style.scss';

function SectionTop() {
  return (
    <div className={CSS.sectionTop}>
      <strong className={CSS.sectionName}>{translate('stories.section.label')}</strong>
      <Link className={CSS.linkEdit} href="/preferences/channels">
        {translate('stories.section.customize')}
      </Link>
    </div>
  );
}

function StoriesSectionWrapper({ hasStories, children }) {
  const storiesClassName = classNames(CSS.stories, {
    [CSS.disableScrolling]: !hasStories,
  });

  return (
    <div data-test-identifier="stories-section" className={CSS.section}>
      <SectionTop />
      <div className={storiesClassName}>{children}</div>
    </div>
  );
}

StoriesSectionWrapper.propTypes = {
  hasStories: bool.isRequired,
  children: node,
};

export default StoriesSectionWrapper;



// WEBPACK FOOTER //
// ./src/js/app/modules/stories/components/StoriesSectionWrapper/index.js