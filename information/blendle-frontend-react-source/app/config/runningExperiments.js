export const EXPERIMENT_AA = 'AA_EXPERIMENT';
export const AA_VARIANT_1 = 'AA_VARIANT_1';
export const AA_VARIANT_2 = 'AA_VARIANT_2';

export const SignupFormOnLanding = 'SignupFormOnLanding';
export const SignupFormOnLandingControl = 'SignupFormOnLandingControl';
export const SignupFormOnLandingInlineForm = 'SignupFormOnLandingInlineForm';
export const SignupFormOnLandingInlineFormWithDetails = 'SignupFormOnLandingInlineFormWithDetails';

export const PremiumLabelsOnCards = 'PremiumLabelsOnCards';
export const PremiumLabelsOnCardsLabels = 'PremiumLabelsOnCardsLabels';
export const PremiumLabelsOnCardsNoLabelsControl = 'PremiumLabelsOnCardsNoLabelsControl';

export const DeeplinkOnboardingSkipProviderStep = 'DeeplinkOnboardingSkipProviderStep';
export const DeeplinkOnboardingSkipProviderStepControl =
  'DeeplinkOnboardingSkipProviderStepControl';
export const DeeplinkOnboardingSkipProviderStepSkipStep =
  'DeeplinkOnboardingSkipProviderStepSkipStep';

// All users get classified in a group for these experiments
export const runningExperiments = [
  {
    name: EXPERIMENT_AA,
    variants: [AA_VARIANT_1, AA_VARIANT_2],
  },
  {
    name: SignupFormOnLanding,
    variants: [
      SignupFormOnLandingControl,
      SignupFormOnLandingInlineForm,
      SignupFormOnLandingInlineFormWithDetails,
    ],
  },
  {
    name: DeeplinkOnboardingSkipProviderStep,
    variants: [
      DeeplinkOnboardingSkipProviderStepControl,
      DeeplinkOnboardingSkipProviderStepSkipStep,
    ],
  },
];

export const forcedVariants = {
  [PremiumLabelsOnCards]: PremiumLabelsOnCardsNoLabelsControl,
};



// WEBPACK FOOTER //
// ./src/js/app/config/runningExperiments.js