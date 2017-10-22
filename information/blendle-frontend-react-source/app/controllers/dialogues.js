import ByeBye from 'byebye';
import React from 'react';
import ReactDOM from 'react-dom';
import i18n from 'instances/i18n';
import Settings from 'controllers/settings';
import Users from 'collections/users';
import VerifyEmailForm from 'components/forms/VerifyEmailForm';
import UsersManager from 'managers/users';
import UsersDialogue from 'components/dialogues/Users';
import VerifiedUserDialogue from 'components/dialogues/VerifiedUser';
import FacebookSignupProgressDialogue from '../components/dialogues/FacebookSignupProgress';
import TypedError from 'helpers/typederror';
import { USER_REJECTED_EMAIL } from 'app-constants';
import Alert from 'components/dialogues/Alert';
import Confirm from 'components/dialogues/Confirm';
import ShareToEmailContainer from 'containers/dialogues/ShareToEmailContainer';

const DialogueController = {
  /**
   * open a dialog with the given react element
   * @param {React.Component} component
   * @returns {Function} close
   */
  openComponent(component) {
    const target = document.querySelector('.a-dialogue');
    ReactDOM.render(component, target);

    return () => {
      ReactDOM.unmountComponentAtNode(target);
    };
  },

  openUserFollowers(analyticsSrc, user_id, from) {
    UsersManager.getUser(user_id).then((user) => {
      let title = '';

      if (user.get('followers') === 1) {
        title = i18n.translate('profile.title.user_followed_by_one', user.get('username'));
      } else {
        title = i18n.translate('profile.title.user_followed_by_many', [
          user.get('followers'),
          user.getFormattedFollowers(),
          user.get('username'),
        ]);
      }

      const users = new Users(null, { url: Settings.getLink('followers', { user_id }) });

      ReactDOM.render(
        <UsersDialogue
          users={users}
          title={title}
          analytics={{
            type: `${analyticsSrc}/followers`,
            user_id: user.id,
          }}
          onClose={() => {
            ReactDOM.unmountComponentAtNode(document.querySelector('.a-dialogue'));
            ByeBye.history.navigate(from, { trigger: true });
          }}
        />,
        document.querySelector('.a-dialogue'),
      );
    });
  },

  openUserFollowing(analyticsSrc, user_id, from) {
    UsersManager.getUser(user_id).then((user) => {
      let title = '';

      if (user.get('follows') === 1) {
        title = i18n.translate('profile.title.user_follows_one', user.get('username'));
      } else {
        title = i18n.translate('profile.title.user_follows_many', [
          user.get('username'),
          user.get('follows'),
          user.getFormattedFollowing(),
        ]);
      }

      const users = new Users(null, { url: Settings.getLink('follows', { user_id }) });

      ReactDOM.render(
        <UsersDialogue
          users={users}
          title={title}
          analytics={{
            type: `${analyticsSrc}/follows`,
            user_id: user.id,
          }}
          onClose={() => {
            ReactDOM.unmountComponentAtNode(document.querySelector('.a-dialogue'));
            ByeBye.history.navigate(from, { trigger: true });
          }}
        />,
        document.querySelector('.a-dialogue'),
      );
    });
  },

  /**
   * Opens a dialogue that lists the given Users
   * @param {String} title
   * @param {Array} users
   */
  openUsers(title, users) {
    ReactDOM.render(
      <UsersDialogue
        users={users}
        title={title}
        analytics={{
          type: 'users',
        }}
        onClose={() => ReactDOM.unmountComponentAtNode(document.querySelector('.a-dialogue'))}
      />,
      document.querySelector('.a-dialogue'),
    );
  },

  openUserVerified(user, rewards) {
    ReactDOM.render(
      <VerifiedUserDialogue
        user={user}
        rewards={rewards}
        onClose={() => {
          ReactDOM.unmountComponentAtNode(document.querySelector('.a-dialogue'));
          ByeBye.history.navigate('', { trigger: true, replace: true });
        }}
      />,
      document.querySelector('.a-dialogue'),
    );
  },

  /**
   * Notify the user that he should continue with the signup progress
   * @param  {User} user
   */
  openSignupProgress(user) {
    const onClose = this.openComponent(
      <FacebookSignupProgressDialogue onClose={() => onClose()} user={user} />,
    );
  },

  /**
   * Asks the user to verify the email that is entered. Just a simple confirm()-like dialogue
   * @param {String} email
   * @param {Function} onVerify
   * @param {Function} onDismiss
   */
  openVerifyEmail(email, onVerify, onDismiss) {
    const onSubmit = (mail) => {
      ReactDOM.unmountComponentAtNode(document.querySelector('.a-dialogue'));
      onVerify(mail);
    };

    const onCancel = () => {
      ReactDOM.unmountComponentAtNode(document.querySelector('.a-dialogue'));

      if (onDismiss) {
        onDismiss(new TypedError(USER_REJECTED_EMAIL, `Users rejected email ${email}`));
      }
    };

    if (document.activeElement) {
      document.activeElement.blur();
    }

    ReactDOM.render(
      <Alert
        className="dialogue-content s-success"
        onConfirm={onSubmit.bind(this)}
        allowClose={false}
      >
        <VerifyEmailForm
          email={email}
          onCancel={onCancel.bind(this)}
          onSubmit={onSubmit.bind(this)}
        />
      </Alert>,
      document.querySelector('.a-dialogue'),
    );
  },

  _showConfirmationMessage(user) {
    UsersManager.requestResetToken(user.get('email')).then(() => {
      const onClose = this.openComponent(
        <Confirm
          title={i18n.translate('app.buttons.submitted')}
          message={i18n.translateElement(
            'settings.profile.password_reset_token_sent',
            user.get('email'),
          )}
          buttonText={i18n.translate('app.buttons.ok')}
          onClose={() => onClose()}
          onConfirm={() => onClose()}
        />,
      );
    });
  },

  resetPassword(user) {
    const onClose = this.openComponent(
      <Confirm
        title={i18n.translate('settings.profile.no_password_set_title')}
        message={i18n.translateElement('settings.profile.no_password_set_more', user.get('email'))}
        buttonText={i18n.translate('settings.profile.no_password_set_button')}
        className="s-success"
        onClose={() => onClose()}
        onConfirm={() => {
          this._showConfirmationMessage(user);
        }}
      />,
    );
  },

  shareToEmail({ manifest, analytics }) {
    const onClose = this.openComponent(
      <ShareToEmailContainer
        manifest={manifest}
        analytics={analytics}
        isVisible
        onClose={() => onClose()}
      />,
    );
  },
};

export default DialogueController;



// WEBPACK FOOTER //
// ./src/js/app/controllers/dialogues.js