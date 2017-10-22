const passwordStrength = require('helpers/passwordstrength');

// @todo Remove this mixin. it is superfluous, only wraps some of the helper methods.
// being used at the SignUp forms

module.exports = {
  getInitialState() {
    return {
      score: null,
    };
  },

  updatePasswordScore(password) {
    this.setState({
      score: passwordStrength.getScore(password),
    });
  },

  getPasswordScore() {
    return this.state.score;
  },

  getPasswordScoreColor() {
    return passwordStrength.getScoreColor(this.state.score);
  },
};



// WEBPACK FOOTER //
// ./src/js/app/components/mixins/passwordStrengthMixin.js