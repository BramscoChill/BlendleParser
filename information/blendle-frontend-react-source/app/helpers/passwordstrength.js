const SHORT = 1;
const WEAK = 2;
const GOOD = 3;
const STRONG = 4;

// source borrowed from
// http://jquerycustomselectbox.googlecode.com/svn/trunk/WebRoot/password_strength/password_strength_plugin.js
function checkRepetition(pLen, str) {
  let res = '';
  let j;
  let i;
  for (i = 0; i < str.length; i++) {
    let repeated = true;
    for (j = 0; j < pLen && j + i + pLen < str.length; j++) {
      repeated = repeated && str.charAt(j + i) === str.charAt(j + i + pLen);
    }
    if (j < pLen) {
      repeated = false;
    }
    if (repeated) {
      i += pLen - 1;
      repeated = false;
    } else {
      res += str.charAt(i);
    }
  }
  return res;
}

function getScore(password) {
  let score = 0;

  if (password.length < 5) {
    return SHORT;
  }

  score += password.length * 4;
  score += checkRepetition(1, password).length - password.length;
  score += checkRepetition(2, password).length - password.length;
  score += checkRepetition(3, password).length - password.length;
  score += checkRepetition(4, password).length - password.length;

  // password has 3 numbers
  if (password.match(/(.*[0-9].*[0-9].*[0-9])/)) {
    score += 5;
  }

  // password has 2 symbols
  if (password.match(/(.*[!,@,#,$,%,^,&,*,?,_,~].*[!,@,#,$,%,^,&,*,?,_,~])/)) {
    score += 5;
  }

  // password has Upper and Lower chars
  if (password.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/)) {
    score += 10;
  }

  // password has number and chars
  if (password.match(/([a-zA-Z])/) && password.match(/([0-9])/)) {
    score += 15;
  }

  // password has number and symbol
  if (password.match(/([!,@,#,$,%,^,&,*,?,_,~])/) && password.match(/([0-9])/)) {
    score += 15;
  }

  // password has char and symbol
  if (password.match(/([!,@,#,$,%,^,&,*,?,_,~])/) && password.match(/([a-zA-Z])/)) {
    score += 15;
  }

  // password is just a numbers or chars
  if (password.match(/^\w+$/) || password.match(/^\d+$/)) {
    score -= 10;
  }

  // verifying 0 < score < 100
  if (score < 0) {
    return SHORT;
  } else if (score < 34) {
    return WEAK;
  } else if (score < 68) {
    return GOOD;
  }
  return STRONG;
}

const colors = {};
colors[SHORT] = '#FF0000';
colors[WEAK] = '#FFD900';
colors[GOOD] = '#FFD900';
colors[STRONG] = '#64B278';

function getScoreColor(score) {
  return colors[score];
}

module.exports = {
  getScore,
  getScoreColor,
  colors,
  SHORT,
  WEAK,
  GOOD,
  STRONG,
};



// WEBPACK FOOTER //
// ./src/js/app/helpers/passwordstrength.js