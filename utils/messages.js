const moment = require('moment');

function formatMessage(username, text) {
  return {
    username,
    text,
    //time: moment().format('h:mm a')
    time: moment().format('HH:mm:ss')
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
//module.exports = formatMessage;
module.exports = {
  formatMessage,
  formatMessage2,
};
