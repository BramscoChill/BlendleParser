import ByeBye from 'byebye';
import React from 'react';
import ReactDOM from 'react-dom';
import constants from 'app-constants';
import RequestManager from 'managers/request';
import Auth from 'controllers/auth';
import Analytics from 'instances/analytics';
import CloseView from 'views/helpers/button_close';
import ProfileView from 'modules/settings/views/profile';
import SocialView from 'modules/settings/views/social';
import WalletView from 'modules/settings/views/wallet';
import CouponsView from 'modules/settings/views/coupons';
import SubscriptionsView from 'modules/settings/views/subscriptions';
import TermsAndConditionsView from 'modules/about/components/TermsAndConditions';
import PrivacyContainer from 'modules/about/containers/PrivacyContainer';
import LabContainer from 'modules/settings/containers/LabContainer';
import PaymentManager from 'managers/payment';
import i18n from 'instances/i18n';
import NotificationsActions from 'actions/NotificationsActions';
import UsersManager from 'managers/users';
import { isObject } from 'lodash';
import RecurringPaymentTriggered from 'components/dialogues/RecurringPaymentTriggered';
import DialogController from 'controllers/dialogues';
import EmailsContainer from 'modules/settings/containers/EmailsContainer';
import SubscriptionsManager from 'managers/subscriptions';
import ResendConfirmationEmailDialogue from 'components/dialogues/ResendConfirmationEmail';
import hasPrivateLabAccess from 'helpers/hasPrivateLabAccess';
import { getException } from 'helpers/countryExceptions';
import SubscriptionsResultContainer from '../components/SubscriptionResultContainer';
import SettingsView from '../views/settings';

const SettingsController = ByeBye.View.extend({
  requireAuth() {
    return Auth.requireSignup();
  },

  setRootView(view) {
    this._rootView = view;
  },

  getRootView() {
    return this._rootView;
  },

  addView(view, name) {
    const root = this.getRootView();
    if (root.getView(name)) {
      const el = root.getView(name).el;
      if (el) {
        ReactDOM.unmountComponentAtNode(el);
        el.parentNode.removeChild(el);
      }
    }
    view.setController(this);
    return root.addView(view, name);
  },

  initialize(options) {
    this.options = options;

    this.model = Auth.getUser();

    // Add main view
    this.setRootView(
      new SettingsView({
        main: options.area,
        closeView: false,
        onClose: options.onClose,
        user: this.model,
        el: options.target,
      }),
    );

    // Make sure we don't get back to the kiosk after closing the settings
    this.getRootView().addView(
      new CloseView({
        onClick: options.onClose,
      }),
    );

    // Bind events for profile view
    this.listenTo(this.getRootView(), 'reloadUser', this._reloadUser);

    this.listenTo(i18n, 'switch', () => {
      this.getRootView().render();
    });
  },

  afterUnload() {
    RequestManager.abort('settings');

    this.stopListening(i18n);
  },
  openProfile(action) {
    RequestManager.abort('settings');

    // Always get a fresh user model? No, right? TODO
    this.model = Auth.getUser();

    this.addView(new ProfileView({ model: this.model }), 'pane');

    if (action) {
      this._performAction(action);
    }

    Analytics.track('View Settings:profile');

    return this.getRootView().render();
  },
  openEmails(query) {
    RequestManager.abort('settings');

    this._emailOptInQuery(query);

    this.addView(
      new ByeBye.ReactView({
        renderComponent: () => <EmailsContainer />,
      }),
      'pane',
    );

    Analytics.track('View Settings:emails');

    return this.getRootView().render();
  },

  openSocial() {
    RequestManager.abort('settings');

    this.addView(new SocialView({ user: this.model }), 'pane');

    Analytics.track('View Settings:social');

    return this.getRootView().render();
  },

  openWallet() {
    RequestManager.abort('settings');
    this.getRootView().setState('loading');
    Analytics.track('View Settings:wallet');

    PaymentManager.getRecurringContract(this.model)
      .then(PaymentManager.getRecurringState)
      .then((recurringData) => {
        this.addView(
          new WalletView({
            model: this.model,
            recurring: recurringData,
            getRecurringState: () =>
              PaymentManager.getRecurringContract(this.model).then(
                PaymentManager.getRecurringState,
              ),
            setRecurringState: state =>
              PaymentManager.setRecurringContract(this.model, state)
                .then(PaymentManager.getRecurringState)
                .then((res) => {
                  if (res.enabled) {
                    Analytics.track('Enabled Recurring Contract');
                  } else {
                    Analytics.track('Disabled Recurring Contract');
                  }
                  return res;
                }),
          }),
          'pane',
        );

        this.getRootView().render();
        this.getRootView().setState('success');
      });
  },

  openRecurringActivate() {
    PaymentManager.getRecurringContract(this.model)
      .then(PaymentManager.getRecurringState)
      .then((recurringData) => {
        const state = recurringData.state;
        let redirect = '/payment';
        if (state === 'norecurring_hascontracts' || state === 'recurring') {
          redirect = 'payment/recurring/activate';
        }

        ByeBye.history.navigate(
          redirect,
          {
            trigger: true,
            replace: true,
          },
          {
            returnUrl: '/settings/wallet',
          },
        );
        this.openWallet();
        this.onRecurringChanged(recurringData);
      });
  },

  onRecurringChanged(recurring = {}) {
    // If the user enables recurring contracts, and their current balance is below the limit,
    // we should do an upgrade
    const balance = Number(this.model.get('balance'));
    if (recurring.enabled === true && balance < constants.RECURRING_MINIMAL_AMOUNT) {
      PaymentManager.upgradeRecurring(Auth.getUser())
        .then(() => {
          this._showRecurringTriggeredDialog();
        })
        .catch((err) => {
          // We want to ignore XHR errors
          if (!err.status) {
            throw err;
          }
        });
    }
  },

  openCoupons(paymentState) {
    this.addView(new CouponsView({ paymentState }), 'pane');

    Analytics.track('View Settings:coupons');

    return this.getRootView().render();
  },
  openSubscriptions(provider) {
    RequestManager.abort('settings');

    this.addView(
      new SubscriptionsView({
        model: this.model,
        provider: typeof provider !== 'string' ? null : provider,
      }),
      'pane',
    );

    Analytics.track('View Settings:subscriptions');

    return this.getRootView().render();
  },

  openSubscriptionsResult(providerId, status) {
    const close = DialogController.openComponent(
      <SubscriptionsResultContainer
        providerId={providerId}
        status={status}
        onClose={() => {
          close();
        }}
      />,
    );

    return this.openSubscriptions(providerId);
  },

  openSubscriptionCallback(provider, code) {
    const authCode = isObject(code) ? code.code || code.token || code.st : code;

    SubscriptionsManager.addSubscriptionWithAuthorizationCode(provider, authCode).then(
      () => {
        Auth.fetchUser().then(() => {
          ByeBye.history.navigate(`settings/subscriptions/${provider}/success`, { trigger: true });
        });
      },
      (response) => {
        let path = 'failed';
        if (response.data.message === 'Subscription already linked') {
          path = 'already_linked';
        } else if (response.data.message === 'No valid subscription found') {
          path = 'no_valid_subscription';
        }
        ByeBye.history.navigate(`settings/subscriptions/${provider}/${path}`, { trigger: true });
      },
    );
  },

  openResetPassword() {
    DialogController.resetPassword(Auth.getUser());
  },

  openTermsAndConditions() {
    RequestManager.abort('settings');

    this.addView(
      new ByeBye.ReactView({
        renderComponent: () => <TermsAndConditionsView />,
      }),
      'pane',
    );

    Analytics.track('View Settings:termsandconditions');

    return this.getRootView().render();
  },
  openPrivacyStatement() {
    RequestManager.abort('settings');

    this.addView(
      new ByeBye.ReactView({
        renderComponent: () => <PrivacyContainer />,
      }),
      'pane',
    );

    Analytics.track('View Settings:privacystatement');

    return this.getRootView().render();
  },

  openLab() {
    RequestManager.abort('settings');

    const labEnabled = getException('showPublicLab', false);
    if (!labEnabled && !hasPrivateLabAccess(Auth.getUser())) {
      return ByeBye.history.navigate('/404', { trigger: true });
    }

    this.addView(
      new ByeBye.ReactView({
        renderComponent: () => <LabContainer />,
      }),
      'pane',
    );

    Analytics.track('View Settings:lab');

    return this.getRootView().render();
  },

  _emailOptInQuery(query) {
    const flags = [
      'alerts',
      'new_edition',
      'read_later',
      'digest',
      'weekly_digest',
      'magazine_digest',
      'marketing',
      'followers',
      'tips',
      'announcements',
      'survey',
    ];

    flags.filter(flag => query[flag]).forEach((flag) => {
      Auth.getUser()
        .saveProperty(`${flag}_opt_out`, false)
        .then(() => {
          Analytics.track(`Opt In: ${flag}`);
        });
    });
  },

  _showRecurringTriggeredDialog() {
    const close = DialogController.openComponent(
      <RecurringPaymentTriggered
        onClose={() => {
          // Refresh balance, just in case
          Auth.fetchUser().then(() => {
            Auth.getUser().trigger('change:balance');
          });

          close();
        }}
      />,
    );
  },

  _reloadUser(actor, changedAttribute) {
    Auth.fetchUser().then((user) => {
      // Since the new Avatar url is exactly the same as the old one, a change won't be triggered
      // even though it needs to for the rest of the application to know the user has changed.
      user.trigger(changedAttribute ? `change:${changedAttribute}` : 'change');
      actor.trigger('userReloaded', user);
    });
  },

  _performAction(action) {
    if (action === 'reconfirm') {
      UsersManager.resendConfirmationEmail(Auth.getId()).then(
        () => {
          const onClose = DialogController.openComponent(
            <ResendConfirmationEmailDialogue
              onClose={() => onClose()}
              email={Auth.getUser().get('email')}
            />,
          );
        },
        () => {
          this.getRootView().error({
            title: i18n.locale.app.error.o_oh,
            message: i18n.locale.settings.emails.confirmation_send_failed,
          });
        },
      );
    }
  },
});

export default SettingsController;



// WEBPACK FOOTER //
// ./src/js/app/modules/settings/controllers/settings.js