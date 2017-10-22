import React, { PropTypes } from 'react';
import { pure } from 'recompose';
import GridContainer from '../GridContainer';
import CSS from './style.scss';

const replaceLinks = original => original.replace(/https:\/\/blendle.com/, '');

const ReadMore = ({ title, picks }) => (
  <div className={CSS.readMore}>
    <GridContainer>
      <h2 className={CSS.title}>{title}</h2>
      <ul className={CSS.picks}>
        {picks.map(pick => (
          <li
            key={pick.title}
            className={CSS.pick}
            dangerouslySetInnerHTML={{ __html: replaceLinks(pick.title) }}
            data-test-identifier="deep-dive-pick-readmore"
          />
        ))}
      </ul>
    </GridContainer>
  </div>
);

ReadMore.propTypes = {
  title: PropTypes.string.isRequired,
  picks: PropTypes.array.isRequired,
};

export const ReadMoreComponent = ReadMore;
export default pure(ReadMore);



// WEBPACK FOOTER //
// ./src/js/app/modules/deepdive/components/ReadMore/index.js