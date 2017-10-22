export const applyBackground = (background) => {
  if (background) {
    return { background };
  }

  return {};
};

export const applyBackgroundImage = (backgroundImage) => {
  if (backgroundImage) {
    return {
      backgroundImage: `url(${backgroundImage})`,
    };
  }

  return {};
};

export const applyTextColor = (textColor) => {
  if (textColor) {
    return { color: textColor };
  }

  return {};
};

export const applyTextShadow = (textShadow = {}) => {
  const hasTextShadow = Boolean(
    textShadow.x !== undefined && textShadow.y !== undefined && textShadow.color !== undefined,
  );

  if (hasTextShadow) {
    return {
      textShadow: `${textShadow.x} ${textShadow.y} 0 ${textShadow.color}`,
    };
  }

  return {};
};

export const applyBoxShadow = (boxShadow = {}) => {
  const hasBoxShadow = Boolean(
    boxShadow.x !== undefined && boxShadow.y !== undefined && boxShadow.color !== undefined,
  );

  if (hasBoxShadow) {
    return {
      boxShadow: `${boxShadow.x} ${boxShadow.y} 0 ${boxShadow.color}`,
    };
  }

  return {};
};



// WEBPACK FOOTER //
// ./src/js/app/modules/deepdive/helpers/applyStyle.js