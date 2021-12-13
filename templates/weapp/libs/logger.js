const { red, green } = require("kolorist");

const logger = {
  error(...args) {
    console.log(red(...args));
  },
  success(...args) {
    console.log(green(...args));
  },
  info(...args) {
    console.log(...args);
  },
};

exports.logger = logger;
