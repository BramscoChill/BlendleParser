import React from 'react';
import PropTypes from 'prop-types';
import { pure } from 'recompose';
import { translateElement } from 'instances/i18n';
import InitialVisibilitySensor from 'components/InitialVisibilitySensor';
import classNames from 'classnames';
import CSS from './style.scss';

const ProviderSubscripion = ({ providerName, subscriptionUid, onChangeVisibility }) => {
  const className = classNames(
    CSS.container,
    CSS.withSharingButtonHeart,
    'v-provider-subscription',
  );

  return (
    <InitialVisibilitySensor onChange={visible => onChangeVisibility(visible, subscriptionUid)}>
      {translateElement(
        <div className={className} />,
        'subscription.end_of_reader',
        {
          providerName,
          href: `/subscription/${subscriptionUid}`,
        },
        false,
      )}
    </InitialVisibilitySensor>
  );
};

ProviderSubscripion.propTypes = {
  providerName: PropTypes.string.isRequired,
  subscriptionUid: PropTypes.string.isRequired,
  onChangeVisibility: PropTypes.func.isRequired,
};

export default pure(ProviderSubscripion);



// WEBPACK FOOTER //
// ./src/js/app/modules/item/components/ProviderSubscription/index.js