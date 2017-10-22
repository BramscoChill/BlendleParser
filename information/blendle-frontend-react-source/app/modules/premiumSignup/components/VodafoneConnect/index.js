import React from 'react';
import { withHandlers, withProps, compose } from 'recompose';
import { Backdrop, Button } from '@blendle/lego';
import withRouter from 'react-router/lib/withRouter';
import { getBaseUrl } from 'helpers/baseUrl';
import AuthStore from 'stores/AuthStore';
import AffiliatesStore from 'stores/AffiliatesStore';
import Auth from 'controllers/auth';
import LogoLink from 'components/navigation/LogoLink';
import CSS from './style.scss';

function logout() {
  const { meta } = AffiliatesStore.getState();
  const params = meta.vodafone_full_url.split('?')[1];
  const returnUrl = `${getBaseUrl()}/getpremium/actie/vodafone/signup?${params}`;

  Auth.logout().then(() => {
    window.location = returnUrl;
  });
}

const enhance = compose(
  withRouter,
  withHandlers({
    redirectToActivate: props => () => props.router.push('/getpremium/activate'),
  }),
  withProps(() => ({
    user: AuthStore.getState().user,
  })),
);

const VodafoneConnect = enhance(({ user, redirectToActivate }) => {
  const { email, first_name: firstName } = user.attributes;
  const ctaCopy = firstName ? `Doorgaan als ${firstName}` : 'Doorgaan';

  return (
    <Backdrop.SmallBottomCenter
      color={'white'}
      innerColor={Backdrop.purple()}
      className={CSS.container}
      rotate={-15}
    >
      <LogoLink width={97} height={26} className={CSS.blendleLogo} />
      <div>
        <span className={CSS.vodafoneLogo} />
        <h1 className={CSS.title}>
          Activeer je 6 maanden
          <br /> gratis Blendle Premium
        </h1>
        <p className={CSS.message}>Check je nog even of het e-mailadres hieronder klopt?</p>
        <p className={CSS.message}>
          Je bent nu ingelogd als <strong>{email}</strong>.{' '}
          <button onClick={logout}>Dit ben ik niet</button>
        </p>
        <Button onClick={redirectToActivate}>{ctaCopy}</Button>
      </div>
    </Backdrop.SmallBottomCenter>
  );
});

export default VodafoneConnect;



// WEBPACK FOOTER //
// ./src/js/app/modules/premiumSignup/components/VodafoneConnect/index.js