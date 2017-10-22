const whitelist = [
  'jwvd', // Joost van Dijk
  'ronmulder',
  'anjavaniersel',
  'kaiwieland',
  'felixhoz',
  'jordiwippert',
  'arnoveenstra',
  'sebastiaanlemmens',
  'huibertscholtens',
  'sjorshofstede',
  'koen', // Koen Bollen
  'thijmenklompmaker',
  'daan7', // Daan Odijk
  'jeffrey52', // Jeffrey Kuiken
  'danielsneijers',
  'danielmartinus', // Dion Segijn
  'jochem', // Jochem van Soest
  'mathieuh', // Mathieu Heruer
  'tiesjoosten',
  'rolandgrootenboer',
  'jort', // Jort de Vries
  'rick', // Rick Pastoor
  'nickvanderwildt',
  'sandervanhoudt', // External, former designer Sander van Houdt
  'jvdheijden',
  'robin', // Robin van Wijngaarden
  'jesse', // Jesse Dijkstra
  'mauricevanw', // Maurice van Wordragen
  'joan', // Joan Pastoor (vrouw van Rick Pastoor)
  'albert56', // Investor
  'koenrh', // Koen Rouwhorst
  'jelmerkoppelmans',
  'jacquelinedijckmanns',
  'erikdejong',
  'martijnspitters',
  'marcelbroeken',
  'janwillemmeer',
  'jasperstein',
  'erik', // Erik Terpstra
  'erics', // Eric Scheers
  'arthurkosten', // Arthur Kosten, External
  'matthiasbraun', // Matthias Braun, Axel Springer
  'mattbraun', // Matthias Braun, Axel Springer, Second Account,
  'jtangelder', // Hammer.js, webpack
  'maartjeterhoeve',
  'elmarburke',
  'murphsy', // Jorrit, de marketing baas, Gernaat,
  'jeffreydegroot',
  // Following users are part of our User Testing Group
  'bouwhouse',
  'rikmoedt',
  'maikeveltman',
  'harryotse',
  'andreasvos',
  'cvanschie',
  'joshi',
  'itom',
  'slaarhuis',
  'govertwondergem',
  'jeanluc033',
  'frankbaars',
  'leonmelein',
  'lmaarschalkerweerd',
  'testuser1',
  'jimkrokke',
  'gcconvent',
  'jobbilsen',
  // end of the list for User Testing Group
  'boudewijnpols1', // Vodafone executive
  'laurabaak', // Vodafone executive
  'olbyova', // US test user
  'annkathrinscholz', // Anna Scholz
  'tmpce4ee884d35e378b7', // Noortje Habets
];

export default function (user) {
  const hasUserPref = user.get('preferences.private_lab_access') === 'true';
  const hasBlendleEmail = /@blendle\.com$/.test(user.get('email'));
  const hasWhitelistedUid = whitelist.includes(user.id.toLowerCase());
  const isAllowedEnviroment = process.env.BUILD_ENV === 'approval';

  return hasUserPref || hasBlendleEmail || hasWhitelistedUid || isAllowedEnviroment;
}



// WEBPACK FOOTER //
// ./src/js/app/helpers/hasPrivateLabAccess.js