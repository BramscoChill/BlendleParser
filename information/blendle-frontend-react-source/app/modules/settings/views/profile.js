import React from 'react';
import ByeBye from 'byebye';
import { each } from 'lodash';
import { keyCode } from 'app-constants';
import UserModel from 'models/user';
import features from 'config/features';
import Analytics from 'instances/analytics';
import i18n from 'instances/i18n';
import AuthManager from 'managers/auth';
import { getException } from 'helpers/countryExceptions';
import AuthController from 'controllers/auth';
import DialogueController from 'controllers/dialogues';
import EnterPasswordDialogue from 'components/dialogues/EnterPassword';
import profileTemplate from 'templates/modules/settings/profile';
import EmailFormElementView from 'views/forms/elements/email';
import AvatarUploaderView from 'views/helpers/avataruploader';
import FormView from 'views/helpers/form';
import LocaleSettingsView from './locale/settings';
import DeleteAccountContainer from '../containers/DeleteAccountContainer';

export default FormView.extend({
  className: 'v-profile pane',

  events: {
    'click .row-attribute': '_eClickRow',
    'click .row-avatar.edit .btn-use-facebook-avatar': '_eUseFacebookAvatar',
    'keyup .row-attribute.edit .inp-text:not(.inp-textarea)': '_eSaveOnEnter',
    'keyup .row-text .inp-textarea.inp-text': '_eTextKeyUp',
    'keyup .row-password .inp': '_ePasswordKeyUp',
    'click .logout-all .lnk-logout': '_eLogoutAll',
  },

  // Fields for which we require a password.
  passwordRestrictedFields: ['email', 'password'],
  waitingForPassword: false,

  fields: {
    // ModelKey => input[name] mapping
    username: 'username',
    text: 'text',
    email: 'email',
    password: 'password',
  },

  _fieldViews: {}, // Store FormInputViews used

  initialize() {
    // Some changes require a password (email, password). We only want the changed values
    // in the request, otherwise we'll need a password every time...
    this.model.allToJSON = false;

    this.avatarFileUpload = new AvatarUploaderView({
      getRow: () => this.el.querySelector('.row-avatar'),
      getController: () => this.getController(),
      getRootView: () => this.getRootView(),
      model: this.model,
    });

    this.addView(this.avatarFileUpload, 'avatar_upload');

    this.applyDefaultEvents();
  },

  _eSaveOnEnter(e) {
    // Will be pressed from an inputfield. Which is two down (two parentNodes to find the row)
    const row = e.delegateTarget.parentNode.parentNode;

    // Save form on enter
    if (!e.ctrlKey && e.keyCode === keyCode.RETURN) {
      e.preventDefault();
      e.stopPropagation();

      this._saveAttribute(row);
    }
  },

  // Override eSubmit to a dummy function. We're only saving attributes via eSaveAttribute.
  _eSubmit(e) {
    e.preventDefault();
    e.stopPropagation();
    return false;
  },

  _eClickRow(e) {
    const row = e.delegateTarget;

    // If the row is already active, we don't have to do anything
    if (!row.classList.contains('edit')) {
      if (!row.classList.contains('uneditable')) {
        // Edit the row
        return this._editAttribute(e.delegateTarget);
      }

      // User doesn't have a password
      DialogueController.resetPassword(this.model);
      this.el.querySelector('.row-password').classList.remove('s-loading');

      e.preventDefault();
      e.stopPropagation();
    } else {
      e.target.classList.contains('lnk-cancel') && this._cancelEditAttribute(row);
      e.target.classList.contains('lnk-save') &&
        !e.target.classList.contains('s-inactive') &&
        this._saveAttribute(row);
    }
  },

  _eLogoutAll(e) {
    e.preventDefault();

    AuthManager.revokeAllRefreshTokens(AuthController.getId()).then(() => {
      window.location = '/';
    });
  },

  _editAttribute(row) {
    // Don't do anything else if we're already editable
    if (row.classList.contains('edit') || row.classList.contains('s-loading')) {
      return;
    }

    // Cancel edit for other attributes
    this._cancelEditAttribute(this.el.querySelector('.row-attribute.edit'));
    const changedAttribute = this._rowAttributeName(row);

    // For password restricted fields, only continue if a current password is set.
    if (
      this.passwordRestrictedFields.indexOf(changedAttribute) !== -1 &&
      !this.model.getCurrentPassword()
    ) {
      this.requirePassword(this._editAttribute.bind(this, row));
      return;
    }

    this._focusRow(row);

    // Show/hide resend-confirmation-mail element when editing row-email
    if (row.classList.contains('row-email')) {
      const resendConfirmation = this.el.querySelector('.resend-confirmation-email');
      if (resendConfirmation) {
        resendConfirmation.classList.add('hidden');
      }
    }
  },

  _focusRow(row) {
    setTimeout(() => {
      row.classList.add('edit');
      row.classList.remove('saved');
      const inp = row.querySelector('input');

      if (inp) {
        inp.focus();
      }
    });
  },

  _cancelEditAttribute(row) {
    if (!row) {
      return;
    }

    const inpText = row.querySelector('.inp-text');
    const attrName = this._rowAttributeName(row);

    this._removeErrorField();

    // Put original value back for text fields
    if (inpText) {
      inpText.value = inpText.original_value || inpText.value;
    }

    if (row.classList.contains('row-avatar')) {
      this.avatarFileUpload.reset();
    }

    // Remove classes
    row.classList.remove('edit');

    // Handle new fangled FormElementViews
    if (this._fieldViews[attrName]) {
      this._fieldViews[attrName].reset();
    }

    // Show/hide resend-confirmation-mail element when editing row-email
    if (row.classList.contains('row-email')) {
      const resendConfirmation = this.el.querySelector('.resend-confirmation-email');
      if (resendConfirmation) {
        resendConfirmation.classList.remove('hidden');
      }
    }
  },

  _saveAttribute(row) {
    if (!row || (!row.querySelector('.inp') && !row.classList.contains('row-avatar'))) {
      return;
    } else if (row && row.classList.contains('row-avatar')) {
      // If we are saving the avatar, just close it
      row.classList.remove('edit');
      return;
    }

    const changedAttribute = this._rowAttributeName(row);

    // For password restricted fields, only continue if a current password is set.
    if (
      this.passwordRestrictedFields.indexOf(changedAttribute) !== -1 &&
      !this.model.getCurrentPassword()
    ) {
      this.requirePassword(this._saveAttribute.bind(this, row));
      return;
    }

    // A failed password callback will call saveUser again, without knowing what
    // attribute was being changed. Setting it here allows us to find it again (used
    // for analytics);
    this._changedAttribute = changedAttribute;

    // Show/hide resend-confirmation-mail element when editing row-email
    if (row.classList.contains('row-email')) {
      const resendConfirmation = this.el.querySelector('.resend-confirmation-email');
      if (resendConfirmation) {
        resendConfirmation.classList.remove('hidden');
      }
    }

    this.saveUser();
  },

  saveUser() {
    // EXTREME HACKS to update the username correctly
    // after the username field was removed from the backend
    // In this commit: https://github.com/blendle/core-api/pull/3291/files#diff-6182bc1d26b68fdbef47b8b1ff94bf19L117
    if (this._changedAttribute === 'username') {
      // eslint-disable-line no-underscore-dangle
      const [firstName, ...lastNames] = this.model.get('username').split(/ +/);
      const lastName = lastNames.join(' ');

      this.model.set({
        first_name: firstName,
        last_name: lastName,
      });
    }

    return this.model
      .save()
      .then(this._userSaved.bind(this))
      .catch(this._userSaveError.bind(this));
  },

  requirePassword(cb) {
    const onClose = DialogueController.openComponent(
      <EnterPasswordDialogue
        cancelCallback={() => {
          this.requiredPasswordCancel();
          onClose();
        }}
        callback={(password) => {
          this.requiredPasswordCallback(password);
          onClose();
          cb();
        }}
      />,
    );
  },

  requiredPasswordCallback(password) {
    this.model.setCurrentPassword(password);
  },

  requiredPasswordCancel() {
    // Cancel edit.
    this._cancelEditAttribute(this.el.querySelector('.row-attribute.edit'));
  },

  _addMaxLengthIndicator() {
    // Create element and append.
    const counter = document.createElement('counter');

    counter.className = 'maxlength-indicator';

    this.dom.inputs.text.parentNode.appendChild(counter);

    this.dom.textMaxLengthCounter = counter;
    this._setTextMaxLengthCounter();
  },

  _eTextKeyUp() {
    this._setTextMaxLengthCounter();
  },

  _setTextMaxLengthCounter() {
    const maxLength = this.dom.inputs.text.getAttribute('maxlength');
    this.dom.textMaxLengthCounter.textContent = maxLength - this.dom.inputs.text.value.length;
  },

  // Enable/disable password save link
  _ePasswordKeyUp() {
    const lnkSave = this.dom.rows.password.querySelector('.lnk-save');
    const modelExpressions = UserModel.prototype.expressions;
    if (modelExpressions.password.test(this.dom.inputs.password.value)) {
      lnkSave.classList.remove('s-inactive');
    } else {
      lnkSave.classList.add('s-inactive');
    }
  },

  _userSaved() {
    // TODO Along with the temporary fetching of the user to check for the has_password flag,
    // this method will be called when the model syncs, without an attributes changed. Catch that.
    if (!this._changedAttribute) {
      return;
    }

    // Update all values
    each(this.el.querySelectorAll('.row-attribute.edit'), (row) => {
      const inp = row.querySelector('.inp');
      const valueEl = row.querySelector('.value');
      let modelKey;

      if (inp) {
        modelKey = this.getModelKey(inp.getAttribute('name'));
      }

      // Put current model value into .value and .inp
      if (row.classList.contains('text')) {
        valueEl['innerText' in valueEl ? 'innerText' : 'textContent'] = inp.value = this.model.get(
          modelKey,
        );

        // Set original value so cancelEdit works correctly.
        inp.setAttribute('data-original-value', inp.value);
      }

      row.classList.remove('edit');
    });

    // If the password was changed, clear the currentPassword, it is useless now.
    if (this._changedAttribute === 'password') {
      this.model.clearCurrentPassword();
    }

    this._rowChanged(this._changedAttribute);

    Analytics.track(`Save Settings: ${this._changedAttribute}`);

    this._changedAttribute = undefined;
  },

  _rowChanged(name) {
    const row = this.el.querySelector(`.row-${name}`);

    // Allow animation to end.
    setTimeout(() => {
      row.classList.add('saved');
    }, 400);

    // and then some.
    setTimeout(() => {
      row.classList.remove('saved');
    }, 4000);
  },

  _rowAttributeName(row) {
    if (row.classList.contains('row-facebook')) {
      return 'facebook_id';
    }

    const inp = row.querySelector('.inp');

    if (inp) {
      return inp.getAttribute('name');
    }
  },

  _userSaveError(resp) {
    // 403? Password required!
    if (resp.status === 403) {
      this.requirePassword(() => {
        this.saveUser();
      });
      return;
    }

    const response = resp.data;
    const message =
      i18n.locale.settings.error.server_errors[response.message] || i18n.locale.app.error.server;
    this.getRootView().error({ message });
  },

  _eUseFacebookAvatar(e) {
    this.avatarFileUpload.useFacebookAvatar();

    e.preventDefault();
    e.stopPropagation();
  },

  // This is only necessary for inp-text
  setOriginalInputValues() {
    each(this.el.querySelectorAll('.inp-text'), (inp) => {
      inp.original_value = inp.value;
    });
  },

  render() {
    this.el.innerHTML = profileTemplate({
      i18n: i18n.locale,
      user: this.options.model,
      features,
    });

    this.setupFormFields();

    this.setupDomLinks({
      rows: {
        avatar: '.row-avatar',
        username: '.row-username',
        text: '.row-text',
        email: '.row-email',
        password: '.row-password',
        facebook: '.row-facebook',
      },
      inputs: {
        username: '.inp-username',
        text: '.inp-textarea.inp-text',
        email: '.inp-email',
        password: '.inp-password',
      },
      buttons: {
        facebook: {
          useAvatar: '.btn-use-facebook-avatar',
          connect: '.btn-facebook-connect',
          disconnect: '.btn-facebook-disconnect',
        },
      },
    });

    // Since we change model values onChange, and change is triggered on blur,
    // we need to store the original values somewhere, so we can put them back on cancelAttribute
    this.setOriginalInputValues();

    // Add maxlength indicator(s)
    this._addMaxLengthIndicator();

    // Install our file upload view
    this.resetFileUploadView();

    if (!getException('hideCountrySetting', false)) {
      this._addLocaleFields();
    } else {
      this.el.querySelector('.locale-settings').classList.add('s-hidden');
    }

    this._addDeleteAccountOption();

    this.display();

    return this;
  },

  setupFormFields() {
    // Create e-mailfield
    this._fieldViews.email = new EmailFormElementView({
      placeholder: i18n.locale.app.user.email,
      value: this.model.get('email'),
    });

    const row = this.el.querySelector('.row-email');
    const nodeAfter = row.querySelector('.lnk-edit');
    row.insertBefore(this._fieldViews.email.render().el, nodeAfter);
  },

  afterRender() {
    // If the user doesn't have a password set, we cannot reset email or password.

    // TODO This is here for a transitional period. Users that are
    // still logged in when we release this will not have the has_password flag
    // yet. Fetch to get it.
    if (this.model.get('has_password') === undefined) {
      this.model.fetch().fin(this.hasPassword.bind(this));
    } else {
      this.hasPassword();
    }
  },

  hasPassword() {
    if (this.model.get('has_password') === false) {
      for (let i = 0; i < this.passwordRestrictedFields.length; i++) {
        this.el
          .querySelector(`.row-${this.passwordRestrictedFields[i]}`)
          .classList.add('uneditable');
      }
    }
  },

  resetFileUploadView() {
    this.el
      .querySelector('.row-avatar')
      .insertBefore(
        this.getView('avatar_upload').render().el,
        this.el.querySelector('.use-facebook-avatar'),
      );
    this.avatarFileUpload._resetAvatarUpload();
  },

  _addLocaleFields() {
    this.addView(
      new LocaleSettingsView({
        model: this.model,
        onSave: (field, key, value, displayValue) => {
          this._saveField(field, key, value, displayValue);
        },
      }),
      'locale',
    );

    this.el.querySelector('.locale-settings').appendChild(this.getView('locale').render().el);
  },

  _addDeleteAccountOption() {
    this.addView(
      new ByeBye.ReactView({
        renderComponent: () => <DeleteAccountContainer />,
      }),
      'delete-account',
    );

    this.el.querySelector('.container').appendChild(this.getView('delete-account').render().el);
  },

  _saveField(field, key, value, displayValue) {
    this.model.set({ [key]: value });

    field.setLoading();

    this.model
      .save()
      .then(() => {
        field.setSuccess();
        field.setValue(value, displayValue);

        if (key === 'country') {
          window.location.reload();
        }
      })
      .catch(field.setError);
  },
});



// WEBPACK FOOTER //
// ./src/js/app/modules/settings/views/profile.js