import React from 'react';
import { shape, string } from 'prop-types';
import { pure } from 'recompose';
import { ChipRow, Chip } from '@blendle/lego';
import CSS from './style.scss';

function Entities({ entities }) {
  return (
    <div className={CSS.entities}>
      <ChipRow>{entities.map(({ title, href }) => <Chip key={href}>{title}</Chip>)}</ChipRow>
    </div>
  );
}

Entities.propTypes = {
  entities: shape({
    href: string.isRequired,
    title: string.isRequired,
  }).isRequired,
};

export default pure(Entities);



// WEBPACK FOOTER //
// ./src/js/app/modules/item/components/Entities/index.js