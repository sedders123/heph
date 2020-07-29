const LogLevels = {
  Error: 0,
  Warning: 1,
  Info: 2,
  Debug: 3,
};
const log = (message, level) => {
  if (process.env.VERBOSE >= level) {
    console.log(message);
  }
};

const logInfo = (message) => log(message, LogLevels.Info);
const logDebug = (message) => log(message, LogLevels.Debug);
const logWarning = (message) => log(message, LogLevels.Warning);
const logError = (message) => log(message, LogLevels.Error);

module.exports = { logInfo, logDebug, logWarning, logError, LogLevels };
