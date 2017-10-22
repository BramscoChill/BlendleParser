function wsjUri() {
  if (process.env.BUILD_ENV === 'approval') {
    return 'https://login.int.wsj.com/auth/oauth2/authorize?response_type=code&redirect_uri=https%3A%2F%2Fapproval.blendle.nl%2Fsettings%2Fsubscriptions%2Fcallback%2Fwsj&scope=email%2Cfirst_name%2Clast_name%2Croles%2Ctrackid%2Crefresh_token&client_id=a40688b344384e0db700bed49cb47be7';
  }
  return 'https://login.wsj.com/auth/oauth2/authorize?response_type=code&redirect_uri=https%3A%2F%2Fblendle.com%2Fsettings%2Fsubscriptions%2Fcallback%2Fwsj&scope=email%2Cfirst_name%2Clast_name%2Croles%2Ctrackid%2Crefresh_token&client_id=a40688b344384e0db700bed49cb47be7';
}

function telegraafUri() {
  if (process.env.BUILD_ENV === 'approval') {
    return 'https://triplea-acc.telegraaf.nl/api/o/authorize/?response_type=code&client_id=wOV7SdNG4wikSwQI4JwsZKsD43PHSspFJ4X8AzmQ&scope=subscription_read&redirect_uri=https%3A%2F%2Fapproval.blendle.com%2Fsettings%2Fsubscriptions%2Fcallback%2Ftelegraaf';
  }
  if (process.env.BUILD_ENV === 'staging') {
    return 'https://triplea.telegraaf.nl/api/o/authorize/?response_type=code&client_id=kCHMTmUlrqp1tVSkJMjrj8yWgS3MhpV52H5UBp3o&scope=subscription_read&redirect_uri=https%3A%2F%2Fstaging.blendle.com%2Fsettings%2Fsubscriptions%2Fcallback%2Ftelegraaf';
  }
  return 'https://triplea.telegraaf.nl/api/o/authorize/?response_type=code&client_id=kCHMTmUlrqp1tVSkJMjrj8yWgS3MhpV52H5UBp3o&scope=subscription_read&redirect_uri=https%3A%2F%2Fblendle.com%2Fsettings%2Fsubscriptions%2Fcallback%2Ftelegraaf';
}

function genjUri(url, service) {
  return `${url}?continueUrl=https%3A%2F%2Fblendle.com%2Fsettings%2Fsubscriptions%2Fcallback%2F${service}`;
}

function sueddeutschezeitungUri(service) {
  if (process.env.BUILD_ENV === 'approval') {
    return 'https://id-stage.sueddeutsche.de/service/ticket?redirect_uri=https://approval.blendle.com/settings/subscriptions/callback/sueddeutschezeitung&service_id=blendle';
  }
  return 'https://id.sueddeutsche.de/service/ticket?redirect_uri=https://blendle.com/settings/subscriptions/callback/sueddeutschezeitung&service_id=blendle';
}

const subscriptions = [
  {
    id: 'par',
    url:
      'https://caps.parool.nl/service/ssologin/index.html?client_id=caps-par-1461&service=https://blendle.com/settings/subscriptions/callback/par',
    redirect: true,
  },
  {
    id: 'vkn',
    url:
      'https://caps.volkskrant.nl/service/ssologin/index.html?client_id=caps-vk-1503&service=https://blendle.com/settings/subscriptions/callback/vkn',
  },
  {
    id: 'adn',
    url:
      'https://caps.ad.nl/service/ssologin/index.html?client_id=caps-ad-1501&service=https://blendle.com/settings/subscriptions/callback/adn',
  },
  {
    id: 'trn',
    url:
      'https://caps.trouw.nl/service/ssologin/index.html?client_id=caps-tr-1502&service=https://blendle.com/settings/subscriptions/callback/trn',
  },
  {
    id: 'lc',
    secondField: {
      secret: true,
    },
  },
  {
    id: 'dvhn',
    secondField: {
      secret: true,
    },
  },
  {
    id: 'sueddeutschezeitung',
    name: 'Süddeutsche Zeitung (Digital)',
    url: sueddeutschezeitungUri(),
  },
  {
    id: 'vn',
    secondField: {
      secret: true,
    },
  },
  {
    id: '360',
    firstField: {
      label: 'E-mail',
    },
    secondField: {
      secret: true,
    },
  },
  {
    id: 'elsevier',
    intro:
      'Voer je abonneenummer en postcode in van je account bij <strong>Elsevier</strong> om je abonnement te koppelen.',
    firstField: {
      label: 'Abonneenummer',
    },
    secondField: {
      label: 'Postcode',
      filter: value => value.replace(' ', ''),
    },
  },
  {
    id: 'newscientist',
    secondField: {
      secret: true,
    },
  },
  {
    id: 'tpomagazine',
    secondField: {
      secret: true,
    },
  },
  {
    id: 'brightideas',
    secondField: {
      secret: true,
    },
  },
  {
    id: 'runners',
    secondField: {
      secret: true,
    },
  },
  {
    id: 'yoga528',
    secondField: {
      secret: true,
    },
  },
  {
    id: 'happinez',
    secondField: {
      secret: true,
    },
  },
  {
    id: 'historischnieuwsblad',
    secondField: {
      secret: true,
    },
  },
  {
    id: 'psychologie',
    secondField: {
      secret: true,
    },
  },
  {
    id: 'filosofiemagazine',
    secondField: {
      secret: true,
    },
  },
  {
    id: 'maarten',
    secondField: {
      secret: true,
    },
  },
  {
    id: 'nedag',
    secondField: {
      secret: true,
    },
  },
  {
    id: 'kicker',
    secondField: {
      secret: true,
    },
  },
  {
    id: 'varagids',
    intro:
      'Voer het relatienummer en huisnummer in van je <strong>Varagids</strong> account om je abonnement te koppelen.',
    firstField: {
      label: 'Relatienummer',
    },
    secondField: {
      label: 'Huisnummer',
    },
  },
  {
    id: 'wallstreetjournal',
    url:
      'https://login.wsj.com/auth/oauth2/authorize?response_type=code&redirect_uri=https%3A%2F%2Fblendle.com%2Fsettings%2Fsubscriptions%2Fcallback%2Fwallstreetjournal&scope=email%2Cfirst_name%2Clast_name%2Croles%2Ctrackid%2Crefresh_token&client_id=a40688b344384e0db700bed49cb47be7',
    redirect: true,
  },
  {
    id: 'wsj',
    url: wsjUri(),
    redirect: true,
  },
  {
    id: 'quest',
    url: genjUri('https://www.quest.nl/entitlement/login/blendle/quest', 'quest'),
    redirect: true,
  },
  {
    id: 'questhistorie',
    url: genjUri('https://www.quest.nl/entitlement/login/blendle/quest_historie', 'questhistorie'),
    redirect: true,
  },
  {
    id: 'questpsychologie',
    url: genjUri(
      'https://www.quest.nl/entitlement/login/blendle/quest_psychologie',
      'questpsychologie',
    ),
    redirect: true,
  },
  {
    id: 'nationalgeographic',
    url: genjUri(
      'https://www.natgeoshop.nl/entitlement/login/blendle/nationalgeographic',
      'nationalgeographic',
    ),
    redirect: true,
  },
  {
    id: 'jan',
    url: genjUri('https://www.jan-magazine.nl/entitlement/login/blendle/jan', 'jan'),
    redirect: true,
  },
  {
    id: 'glamour',
    url: genjUri('https://www.glamour.nl/entitlement/login/blendle/glamour', 'glamour'),
    redirect: true,
  },
  {
    id: 'vogue',
    url: genjUri('https://www.vogue.nl/entitlement/login/blendle/vogue', 'vogue'),
    redirect: true,
  },
  {
    id: 'telegraaf',
    name: 'Telegraaf (Digitaal)',
    url: telegraafUri(),
    redirect: true,
  },
  {
    id: 'zeit',
    secondField: {
      secret: true,
    },
  },
];

export default subscriptions;



// WEBPACK FOOTER //
// ./src/js/app/config/subscriptions.js