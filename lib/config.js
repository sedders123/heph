const toml = require("@iarna/toml");
const fs = require("fs");
const findUp = require("find-up");
const { logInfo } = require("./log");

const setVerbosityLevel = (level = 0) => (process.env.VERBOSE = level);
const getVerbosityLevel = () => process.env.VERBOSE;

const loadConfig = () => {
  const path = findUp.sync("heph.toml");
  logInfo("Loading " + path);
  const config = toml.parse(fs.readFileSync(path, "utf-8"));
  config.CONFIG_PATH = path;
  return config;
};

module.exports = {
  loadConfig,
  getVerbosityLevel,
  setVerbosityLevel,
};
