const _ = require('lodash');
const i18n = require('instances/i18n');
const Facebook = require('instances/facebook');
const Settings = require('controllers/settings');
const Auth = require('controllers/auth');
const FileUploadView = require('./fileupload');
const avatarButtonsTemplate = require('templates/modules/settings/avatar_buttons');

export default FileUploadView.extend({
  initialize() {
    this.options = _.extend(this.options, {
      url: `${Settings.get('links').user.href.replace('{user_id}', Auth.getId())}/avatars`,
      name: 'avatar',
      autoUpload: true,
      currentImage: Auth.getUser().getAvatarHref(),
      onUploadStart: () => {
        this.options.getRow().classList.add('uploading');
        this.el.querySelector('.upload-dropzone').innerHTML =
          i18n.locale.settings.profile.avatar_uploading;
      },
      onUploadSuccess: () => {
        const row = this.options.getRow();
        row.classList.remove('uploading', 'dragover', 'preview', 'edit');

        // Reload model (to get the new avatar url with cachebust attached)
        // and redraw avatar field.
        this._updateAvatar();
      },
      onUploadFailed: (error) => {
        const row = this.options.getRow();
        row.classList.remove('s-loading', 'uploading', 'dragover');

        if (!error.type || error.type === '') {
          error.type = 'server_error';
        }

        this.options.getRootView().error({
          message: i18n.locale.settings.error.upload_error[error.type],
        });

        this._setAvatar();
        this.options.resetAvatarUpload();
      },
      onDragStateChanged: (dragging) => {
        this.options.getRow().classList.toggle('dragover', dragging);
      },
    });

    // Load Facebook button
    Facebook.load().catch(this._removeFacebookAvatar.bind(this));

    this.options.model.fetch().fin(() => {
      this._addFacebookButton();
      this._bindInputClick();
    });
  },

  _updateAvatar() {
    this._setLoading();

    this.options.model.fetch().fin(() => {
      this._setAvatar();
      this._resetAvatarUpload();
    });
  },

  _setAvatar() {
    const model = this.options.model;
    const row = this.options.getRow();

    row.querySelector('.img-avatar').src = model.getAvatarThumbnail();
    row.querySelector('.img-preview').src = model.getAvatarHref();

    this.setCurrentImage(model.getAvatarHref());

    this._setLoading(false);
  },

  _resetAvatarUpload() {
    this._addFacebookButton();
    this._bindInputClick();

    if (this.model.get('facebook_id')) {
      Facebook.getMe()
        .then((me) => {
          const avatar = Facebook.getAvatarWithDimensions(me.id, 100, 100);

          this.el.querySelector('.use-facebook-avatar').classList.add('show');
          this.el.querySelector('.row-avatar .facebook-avatar').src = avatar;
        })
        .catch(() => {});
    }
  },

  _bindInputClick() {
    this.addEventListener(this.dom.dropZone, 'click', (e) => {
      if (!/facebook|inp-file/.test(e.target.classList.toString())) {
        this.openFileDialog();
      }
    });
  },

  _addFacebookButton() {
    this.render().el.querySelector('.upload-dropzone').innerHTML = avatarButtonsTemplate({
      i18n: i18n.locale,
      facebook: this.options.model.get('facebook_id'),
    });
  },

  _removeFacebookAvatar() {
    const facebookButtonEl = this.el.querySelector('.btn-use-facebook-avatar');

    if (facebookButtonEl) {
      facebookButtonEl.classList.remove('s-loading');
      facebookButtonEl.textContent = i18n.locale.app.error.facebook_unavailable;
    }
  },

  _setLoading(loading = true) {
    this.options.getRow().classList.toggle('s-loading', loading);
  },

  useFacebookAvatar() {
    this._setLoading();

    Facebook.getMe().then((me) => {
      this.options.model.useAvatarUrl(Facebook.getAvatar(me.id, 'large'), (success) => {
        if (success) {
          this._updateAvatar();
        } else {
          this._setLoading(false);

          this.options.getRootView().error({
            message: i18n.locale.settings.error.upload_error.server_error,
          });
        }
      });
    });
  },
});



// WEBPACK FOOTER //
// ./src/js/app/views/helpers/avataruploader.js