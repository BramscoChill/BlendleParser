export function getTimeOfDay(date = new Date()) {
  const hour = date.getHours();

  const startOfNight = 23;
  const endOfNight = 5;
  const startOfMorning = endOfNight;
  const endOfMorning = 12;
  const startOfAfternoon = endOfMorning;
  const endOfAfternoon = 18;
  const startOfEvening = endOfAfternoon;
  const endOfEvening = startOfNight;

  if (hour >= startOfMorning && hour < endOfMorning) {
    return 'morning';
  }

  if (hour >= startOfAfternoon && hour < endOfAfternoon) {
    return 'afternoon';
  }

  if (hour >= startOfEvening && hour < endOfEvening) {
    return 'evening';
  }

  return 'night';
}

export function getTimeOfDayPhraseId(timeOfDay, firstName) {
  const phraseId = `app.time_of_day.${timeOfDay}.greeting_${firstName
    ? 'with_name'
    : 'without_name'}`;

  return phraseId;
}



// WEBPACK FOOTER //
// ./src/js/app/modules/sectionsPage/helpers/timeOfDay.js