import React from 'react';
import PropTypes from 'prop-types';
import CSS from './styles.scss';

const illustrationPath = '/img/illustrations/premium';

const Illustration = ({ name }) => {
  const path = `${illustrationPath}/${name}`;
  return (
    <div className={CSS.illustration}>
      <img
        src={`${path}@2x.png`}
        srcSet={`${path}.png 1x, ${path}@2x.png 2x`}
        role="presentation"
      />
    </div>
  );
};

Illustration.propTypes = {
  name: PropTypes.string.isRequired,
};

export default Illustration;



// WEBPACK FOOTER //
// ./src/js/app/modules/item/components/SignUpRewardDialog/Illustration/index.js