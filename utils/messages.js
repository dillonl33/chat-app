const moment = require('moment');

function formatMessage(username, text) {
  return {
    username,
    text,
    time: moment().format('h:mm a')
  };
}

function formatMessage2(username, text, time) {
  return {
    username,
    text,
    time
  };
}

// how can I have both?
module.exports = formatMessage2;
module.exports = formatMessage;
