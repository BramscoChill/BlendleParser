import LibLoader from 'helpers/libloader';

export default function loadScriptsWhenIdle(files) {
  return new Promise((resolve) => {
    const stack = [...files];

    function loadNext() {
      if (!stack.length) {
        return resolve();
      }

      return new Promise(() => {
        window.requestIdleCallback(() => {
          const file = stack.shift();

          // already added
          if (document.querySelector(`script[src="${file}"]`)) {
            loadNext();
            return;
          }

          const loader = new LibLoader(file, () => {});
          loader.load().then(loadNext, loadNext);
        });
      });
    }

    loadNext();
  });
}



// WEBPACK FOOTER //
// ./src/js/app/helpers/loadScriptsWhenIdle.js