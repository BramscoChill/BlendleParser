export default (element) => {
  const wrapper = document.createElement('div');
  wrapper.appendChild(element);

  return wrapper.innerHTML;
};



// WEBPACK FOOTER //
// ./src/js/app/helpers/elementToString.js