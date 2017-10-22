module.exports = (function () {
  const _ = require('lodash');
  const ByeBye = require('byebye');
  const React = require('react');
  const ApplicationState = require('instances/application_state');
  const Settings = require('controllers/settings');
  const Auth = require('controllers/auth');
  const SubscriptionsManager = require('managers/subscriptions');
  const Subscriptions = require('collections/subscriptions');
  const { providerById, prefillSelector } = require('selectors/providers');
  const DropdownView = require('views/helpers/dropdown');
  const i18n = require('instances/i18n');
  const Country = require('instances/country');
  const subscriptionsTemplate = require('templates/modules/settings/subscriptions');
  const SubscriptionFormContainer = require('../components/SubscriptionFormContainer');
  const SubscriptionsContainer = require('../containers/SubscriptionsContainer');
  const SubscriptionsActions = require('actions/SubscriptionsActions');
  const PremiumBannerContainer = require('modules/item/containers/GetPremiumBannerContainer');

  const SubscriptionsView = ByeBye.View.extend({
    className: 'v-subscriptions pane',

    events: {
      'click .btn-add-subscription': '_addSubscription',
    },

    initialize() {
      this.subscriptions = new Subscriptions();

      this.providers = SubscriptionsManager.getProviders();

      // Allow subscriptionViews to remove themselves.
      this.listenTo(this, 'removeView', this.removeView);
    },

    _renderAddSubscriptionDialogue(providerId) {
      const provider = prefillSelector(providerById)(providerId);

      const dialogue = (
        <SubscriptionFormContainer
          provider={provider}
          data={this._getDataForProvider(providerId)}
          onSuccess={() => {
            // Refresh subscriptions list
            SubscriptionsActions.fetchUserSubscriptions(Auth.getId(), Auth.getToken());

            this.getController().openSubscriptionsResult(providerId, 'success');

            // prevent the SubscriptionFormContainer from rendering
            return false;
          }}
        />
      );

      this.addView(
        new ByeBye.ReactView({
          renderComponent: () => dialogue,
        }),
        'dialogue',
      );

      this.getView('dialogue').render();
    },

    _addSubscription(e) {
      const self = this;

      e.preventDefault();
      e.stopPropagation();

      const providerId = this.providersDropdown.getSelected();

      const providerLink = this._getLinkForProvider(providerId);

      if (providerLink) {
        ApplicationState.saveToCookie();

        window.location = providerLink.replace('{user_id}', Auth.getId());
      } else {
        this._renderAddSubscriptionDialogue(providerId);
      }
    },

    getProviders() {
      return (
        this.providers
          .filter(subscriptionProvider => prefillSelector(providerById)(subscriptionProvider.id))
          .map((subscriptionProvider) => {
            const provider = prefillSelector(providerById)(subscriptionProvider.id);

            // For some providers, the subscription name is not the same as the provider name
            const name = subscriptionProvider.name || provider.name;

            return {
              name,
              country: i18n.getCountryCode(provider.language),
              ...subscriptionProvider,
            };
          })
          // Sort by country, then alphabetically
          .sort((a, b) => {
            const nameA = a.name.toUpperCase();
            const nameB = b.name.toUpperCase();
            const countryA = a.country === Country.getCountryCode();
            const countryB = b.country === Country.getCountryCode();

            if (countryA && !countryB) {
              return -1;
            }

            if (!countryA && countryB) {
              return 1;
            }

            if (nameA < nameB) {
              return -1;
            }

            if (nameA > nameB) {
              return 1;
            }

            return 0;
          })
          .reduce((providers, provider) => {
            providers[provider.id] = provider.name;

            return providers;
          }, {})
      );
    },

    render() {
      this.el.innerHTML = subscriptionsTemplate({
        i18n: i18n.locale,
        user: this.options.model,
        providers: this.getProviders(),
      });

      this.providersDropdown = new DropdownView(this.getProviders(), {
        selected: this.options.provider,
      });
      this.addView(this.providersDropdown, 'providers_dropdown');
      this.el
        .querySelector('.dropdown-holder')
        .insertBefore(
          this.providersDropdown.render().el,
          this.el.querySelector('.dropdown-holder').querySelector('.missing-provider'),
        );

      this.display();

      const premiumBanner = this.addView(
        new ByeBye.ReactView({
          renderComponent: () => (
            <PremiumBannerContainer
              shouldHideOnMobile={false}
              shouldCheckItemConditions={false}
              analytics={{
                internal_location: 'settings',
              }}
            />
          ),
        }),
        'premiumBanner',
      );

      const subscriptions = this.addView(
        new ByeBye.ReactView({
          renderComponent: () => <SubscriptionsContainer />,
        }),
        'subscriptions',
      );

      this.el.querySelector('.banner-container').appendChild(premiumBanner.render().el);
      this.el.querySelector('.overview-holder').appendChild(subscriptions.render().el);

      return this;
    },

    _getDataForProvider(providerId) {
      return _.find(this.providers, { id: providerId });
    },

    _getLinkForProvider(providerId) {
      return this._getDataForProvider(providerId).url;
    },
  });
  return SubscriptionsView;
}());



// WEBPACK FOOTER //
// ./src/js/app/modules/settings/views/subscriptions.js