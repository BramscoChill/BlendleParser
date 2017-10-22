import React from 'react';
import { withHandlers } from 'recompose';
import { oneOf, string } from 'prop-types';
import classNames from 'classnames';
import FacebookIcon from 'components/icons/Facebook';
import TwitterIcon from 'components/icons/Twitter';
import LinkedInIcon from 'components/icons/LinkedIn';
import WhatsAppIcon from 'components/icons/WhatsApp';
import EmailIcon from 'components/icons/Envelope';
import CSS from './style.scss';

const icons = new Map([
  ['facebook', FacebookIcon],
  ['twitter', TwitterIcon],
  ['whatsapp', WhatsAppIcon],
  ['email', EmailIcon],
  ['linkedin', LinkedInIcon],
]);

function SharingButton({ platform, className, ...rest }) {
  const Icon = icons.get(platform);

  return (
    <button className={classNames(CSS.shareButton, CSS[platform], className)} {...rest}>
      <Icon className={CSS.icon} />
    </button>
  );
}

SharingButton.propTypes = {
  platform: oneOf(Array.from(icons.keys())).isRequired,
  className: string,
};

const enhance = withHandlers({
  onClick: ({ onClick, platform }) => event => onClick(platform, event),
});

export default enhance(SharingButton);



// WEBPACK FOOTER //
// ./src/js/app/components/SharingButton/index.js