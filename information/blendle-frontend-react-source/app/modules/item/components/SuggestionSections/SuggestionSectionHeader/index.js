import React from 'react';
import { node } from 'prop-types';
import CSS from './style.scss';

function SuggestionSectionHeader({ title }) {
  return (
    <header className={CSS.header}>
      <h2 className={CSS.suggestionSectionHeader}>{title}</h2>
    </header>
  );
}

SuggestionSectionHeader.propTypes = {
  title: node.isRequired,
};

export default SuggestionSectionHeader;



// WEBPACK FOOTER //
// ./src/js/app/modules/item/components/SuggestionSections/SuggestionSectionHeader/index.js