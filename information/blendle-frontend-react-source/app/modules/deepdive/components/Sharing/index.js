import React from 'react';
import { func } from 'prop-types';
import SharingButton from 'components/SharingButton';
import GridContainer from '../GridContainer';
import CSS from './style.scss';

const socialPlatforms = ['facebook', 'twitter', 'whatsapp', 'email', 'linkedin'];

function Sharing({ onShare }) {
  return (
    <div className={CSS.sharing}>
      <GridContainer>
        <p className={CSS.text}>Iets geleerd? Deel deze Deep Dive met je&nbsp;vrienden!</p>
        <div className={CSS.buttons}>
          {socialPlatforms.map(platform => (
            <SharingButton
              key={platform}
              platform={platform}
              className={CSS[platform]}
              onClick={onShare}
            />
          ))}
        </div>
      </GridContainer>
    </div>
  );
}

Sharing.propTypes = {
  onShare: func.isRequired,
};

export default Sharing;



// WEBPACK FOOTER //
// ./src/js/app/modules/deepdive/components/Sharing/index.js