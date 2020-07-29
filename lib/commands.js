const { loadConfig } = require("./config");
const util = require("util");
const inquirer = require("inquirer");
const { logDebug } = require("./log");
const { setupComponent } = require("./utils");

const up = () => {
  const config = loadConfig();
  inquirer
    .prompt([
      {
        type: "checkbox",
        name: "components",
        message: "Which componenets would you like to set up?",
        choices: Object.keys(config.components),
      },
    ])
    .then((answers) => {
      logDebug(`Starting setup for ${answers.components.join(",")}`);
      answers.components.forEach((component) =>
        setupComponent(component, config)
      );
    });
};

const dump = () => {
  const config = loadConfig();
  console.log(util.inspect(config, false, 3, true));
};

module.exports = { up, dump };
