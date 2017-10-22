import React from 'react';
import NavigationBarContainer from 'containers/navigation/NavigationBarContainer';
import CSS from './style.scss';

function NavigationBarWrapper() {
  return (
    <div className={CSS.navigationBar}>
      <NavigationBarContainer />
    </div>
  );
}

export default NavigationBarWrapper;



// WEBPACK FOOTER //
// ./src/js/app/modules/signup/components/NavigationBar/index.js