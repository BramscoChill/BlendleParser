import React from 'react';
import { string } from 'prop-types';
import { config as i18nConfig } from 'instances/i18n';
import { SmallScreenOnly, NotSmallScreen } from 'components/BreakPoints';
import HTMLWithLinks from 'components/HTMLWithLinks';
import FormattedDate from 'components/FormattedDate';
import CSS from './style.scss';

const alignment = [CSS.horizontalAlignment, CSS.verticalAlignment].join(' ');

const linkProps = {
  analytics: { type: 'sections-intro' },
};

function Intro({ introHtml, date, timeOfDayTitle }) {
  return (
    <div className={alignment}>
      <NotSmallScreen>
        <span>
          <FormattedDate
            date={date}
            format={i18nConfig.sectionIntroLongDateFormat}
            className={CSS.date}
            component="strong"
          />
          <h2 className={CSS.timeOfDay}>{timeOfDayTitle}</h2>
        </span>
      </NotSmallScreen>
      <SmallScreenOnly>
        <FormattedDate date={date} format="dddd" className={CSS.timeOfDay} component="h2" />
      </SmallScreenOnly>
      <HTMLWithLinks className={CSS.intro} linkProps={linkProps}>
        {introHtml}
      </HTMLWithLinks>
    </div>
  );
}

Intro.propTypes = {
  introHtml: string,
  date: string.isRequired,
  timeOfDayTitle: string.isRequired,
};

Intro.defaultProps = {
  introHtml: '',
};

export default Intro;



// WEBPACK FOOTER //
// ./src/js/app/modules/sectionsPage/components/Intro/index.js