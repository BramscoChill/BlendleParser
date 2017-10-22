import Environment from 'environment';

export default (imagePath) => {
  if (Environment.name !== 'production') {
    return imagePath;
  }

  return `https://assets.blendleimg.com${imagePath}`;
};



// WEBPACK FOOTER //
// ./src/js/app/helpers/staticImageUrl.js