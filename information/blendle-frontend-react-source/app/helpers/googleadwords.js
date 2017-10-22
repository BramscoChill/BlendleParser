module.exports = (function () {
  const conversion_img_url =
    '//www.googleadservices.com/pagead/conversion/{conversion_id}/?label={label}&amp;guid=ON&amp;script=0';

  const addConversionImage = function (url) {
    const img = document.createElement('img');
    img.src = url;
    // Remove the image again after we've loaded it (or it errored, whatever)
    img.onload = img.onerror = function () {
      if (img.parentNode) {
        img.parentNode.removeChild(img);
      }
    };

    document.body.appendChild(img);
  };

  function GoogleAdwords(conversion_id, label_mapping) {
    this.enabled = true;

    this.conversion_id = conversion_id;
    this.label_mapping = label_mapping || {};

    this.conversion_img_url = conversion_img_url.replace('{conversion_id}', conversion_id);
  }

  GoogleAdwords.prototype = {
    disable() {
      this.enabled = false;
    },
    enable() {
      this.enabled = true;
    },
    getLabel(label) {
      return this.label_mapping[label] || label;
    },
    conversion(label) {
      if (this.enabled) {
        addConversionImage(this.conversion_img_url.replace('{label}', this.getLabel(label)));
      }
    },
  };

  return GoogleAdwords;
}());



// WEBPACK FOOTER //
// ./src/js/app/helpers/googleadwords.js