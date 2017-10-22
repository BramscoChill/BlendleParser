import { Model } from 'byebye';

const IssueAcquisition = Model.extend({
  name: 'issue-acquisition',
  defaults: {
    acquirable: true,
    subscription: false,
  },

  /**
   * Get the percentage of the issue that has been purchased
   * @return percentage of issue purchased
   */
  getPercentagePurchased() {
    // If acquired, return fully purchased percentage because the price is not set to null.
    if (this.get('acquired')) {
      return 1;
    }

    return this.getRealPercentagePurchased();
  },

  /**
   * Get the real percentage purchased.
   * @return {int} percentage of issue purchased
   */
  getRealPercentagePurchased() {
    if (this.get('price') === null || this.get('original_price') === null) {
      return 0;
    }

    const realPercentage = 1 - this.get('price') / this.get('original_price');
    return Math.round(realPercentage * 100) / 100;
  },

  /**
   * Check if the issue is eligible for acquisition
   * @return {Boolean}
   */
  isEligibleForAcquisition() {
    return (
      this.get('original_price') !== null && !this.get('subscription') && this.get('acquirable')
    );
  },
});

export default IssueAcquisition;



// WEBPACK FOOTER //
// ./src/js/app/models/issueacquisition.js