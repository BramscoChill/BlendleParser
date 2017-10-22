const emailProviderWebclients = [
  { regex: /@(googlemail|gmail|blendle)\.com$/, url: 'https://mail.google.com' },
  { regex: /@yahoo\.com$/, url: 'https://mail.yahoo.com' },
  { regex: /@(live|hotmail|outlook)\.([a-z]+)$/, url: 'https://outlook.com' },
  { regex: /@inbox\.com$/, url: 'https://inbox.com' },
  { regex: /@mail\.com$/, url: 'https://mail.com' },
  { regex: /@(me|icloud)\.com$/, url: 'https://icloud.com' },
  { regex: /@aol\.com$/, url: 'https://aol.com' },
];

export default function (email) {
  for (let i = 0; i < emailProviderWebclients.length; i++) {
    const service = emailProviderWebclients[i];
    if (service.regex.test(email.toLowerCase())) {
      return service.url;
    }
  }
  return null;
}



// WEBPACK FOOTER //
// ./src/js/app/helpers/emailProviderWebclient.js