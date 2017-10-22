import moment from 'moment';
import { translateElement } from 'instances/i18n';

function todayOrYesterday(date, translateKey, translateOptions) {
  return translateElement(translateKey, {
    date: date.calendar(),
    ...translateOptions,
  });
}

function thisWeek(date, translateKey, translateOptions) {
  return translateElement(translateKey, {
    date: date.format('dddd'),
    ...translateOptions,
  });
}

function earlier(date, translateKey, translateOptions) {
  return translateElement(translateKey, {
    date: date.format('LL'),
    ...translateOptions,
  });
}

function getDateDetails(date) {
  const publicationDate = date.startOf('day').add(1, 'second');

  const startOfYesterday = moment()
    .startOf('day')
    .subtract(1, 'day');
  const startOfWeek = moment()
    .startOf('day')
    .subtract(7, 'days');

  const wasTodayOrYesterday = startOfYesterday.isBefore(publicationDate);
  const wasThisWeek = startOfWeek.isBefore(date.startOf('day'));

  return {
    wasTodayOrYesterday,
    wasThisWeek,
  };
}

export function getDateString(date, options = { todayOrYesterday: true }) {
  const dateDetails = getDateDetails(date);

  if (options.todayOrYesterday && dateDetails.wasTodayOrYesterday) {
    return date.calendar();
  }

  if (dateDetails.wasThisWeek) {
    return date.format('dddd');
  }

  return date.format('LL');
}

export function getIssueDateString(date, providerName) {
  const dateDetails = getDateDetails(date);

  // German "von" for today/yesterday
  if (dateDetails.wasTodayOrYesterday) {
    return todayOrYesterday(date, 'app.issue.today_yesterday', {
      provider: providerName,
    });
  }

  // German "vom" for week names and "last"/"afgelopen" in EN and NL
  if (dateDetails.wasThisWeek) {
    return thisWeek(date, 'app.issue.this_week', {
      provider: providerName,
    });
  }

  // "Edition of" in EN
  return earlier(date, 'app.issue.earlier', {
    provider: providerName,
  });
}



// WEBPACK FOOTER //
// ./src/js/app/helpers/dateString.js