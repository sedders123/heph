const { dirname, join } = require("path");
const { logInfo } = require("./log");
const { exec } = require("child_process");

const getBasePath = (configPath, base_directory) => {
  const configDirPath = dirname(configPath);
  if (base_directory == null) {
    return configDirPath;
  }
  return join(configDirPath, base_directory); //TODO: Check this actually exists, error if it doesn't
};

const setupComponent = (component, config) => {
  logInfo(`Starting setup for component: ${component}`);
  // TODO: Dependency checking
  // if (config.components[component].deps != null) {
  //   // check dependencies
  //   const missingDependencies = getMissingDependencies(
  //     config.components[component].deps
  //   );
  //   installDependencies(missingDependencies);
  // }
  if (config.components[component].setup_commands != null) {
    // run setup scripts
    config.components[component].setup_commands.forEach((command) => {
      const basePath = getBasePath(
        config.CONFIG_PATH,
        config.components[component].base_directory
      );
      const commandProcess = exec(command, { cwd: basePath });
      commandProcess.stdout.pipe(process.stdout);
      commandProcess.stderr.pipe(process.stderr);
    });
  }
};

module.exports = { getBasePath, setupComponent };
