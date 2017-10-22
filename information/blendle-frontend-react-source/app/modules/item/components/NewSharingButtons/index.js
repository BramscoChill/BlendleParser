import React from 'react';
import PropTypes from 'prop-types';
import { compose, pure, withHandlers, setPropTypes } from 'recompose';
import classNames from 'classnames';
import SharingButton from 'components/SharingButton';
import withShareToEmail from '../../higher-order-components/withShareToEmail';
import CSS from './style.scss';

const socialPlatforms = ['facebook', 'twitter', 'whatsapp', 'email', 'linkedin'];

const enhance = compose(
  setPropTypes({
    itemId: PropTypes.string.isRequired,
    onSocialShare: PropTypes.func.isRequired,
    analytics: PropTypes.object,
  }),
  withShareToEmail,
  withHandlers({
    onShare: props => (platform, event) => {
      event.preventDefault();
      if (platform === 'email') {
        props.openEmailShareDialog();
      } else {
        props.onSocialShare(platform);
      }
    },
  }),
  pure,
);

const SharingButtons = enhance(({ className, onShare }) => (
  <div className={classNames(CSS.container, className)}>
    {socialPlatforms.map(platform => (
      <SharingButton
        key={platform}
        onClick={onShare}
        platform={platform}
        className={CSS[platform]}
      />
    ))}
  </div>
));

export default SharingButtons;



// WEBPACK FOOTER //
// ./src/js/app/modules/item/components/NewSharingButtons/index.js