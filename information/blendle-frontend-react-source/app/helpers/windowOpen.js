/**
 * open a centered popup window
 * @param src
 * @param name
 * @param width
 * @param height
 * @param options
 */
export default function ({ src, name, width, height, options }) {
  const windowOptions = options || 'scrollbars=yes,resizable=yes,toolbar=no,location=yes';

  const left = Math.round(screen.width / 2 - width / 2);
  const top = screen.height > height ? Math.round(screen.height / 2 - height / 2) : 0;

  return window.open(
    src,
    name,
    `width=${width},height=${height},left=${left},top=${top},${windowOptions}`,
  );
}



// WEBPACK FOOTER //
// ./src/js/app/helpers/windowOpen.js