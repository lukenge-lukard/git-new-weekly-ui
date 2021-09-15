const moment = require('moment');
// moment.add(3, hours)
// moment().format(`h:mm:ss a`).add(3, hours)
// var jstz = require('jstz');
//   var timezone = jstz.determine();
//   var momentTz = require('moment-timezone');
//   momentTz().tz(timezone).format();

function formatMessage(username, text) {
  // let times = moment().format(`h:mm:ss a`);

  return {
    username,
    text,
    // time: moment().format(`h:mm:ss a`).add(3, 'hours')
    // time: momentTz().tz(timezone).format(`h:mm:ss a`)
    time: moment().utcOffset('+0300').format('hh:mm a')
  };
}

module.exports = formatMessage;
