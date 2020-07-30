const { dirname, join } = require("path");
const { logInfo, logError } = require("./log");
const { exec, execSync } = require("child_process");
const { existsSync } = require("fs");
const compareVersions = require("compare-versions");

const getBasePath = (configPath, base_directory) => {
  const configDirPath = dirname(configPath);
  if (base_directory == null) {
    return configDirPath;
  }
  const path = join(configDirPath, base_directory);
  if (!existsSync(path)) {
    logError(`${base_directory} not found in ${configDirPath}`);
    process.exitCode = 1;
  } else {
    return path;
  }
};

const getDependencyVersion = (dependency) => {
  try {
    const depCheckProcess = execSync(
      `${dependency.command} ${
        dependency.versionFlag ? dependency.versionFlag : "--version"
      }`
    );
    const output = depCheckProcess.toString();
    return output.trim();
  } catch (error) {
    //TODO: Error cases need testing
    return null;
  }
};

// TODO: Allow max version on dependencies
const getMissingDependencies = (componentDeps, deps) => {
  const missingDeps = [];
  componentDeps.forEach((dep) => {
    const dependency = deps[dep];
    const installedVersion = getDependencyVersion(dependency);
    if (
      !installedVersion ||
      (dependency.min_version &&
        compareVersions(installedVersion, deps[dep].min_version) < 0)
    ) {
      missingDeps.push({
        name: dep,
        installedVersion,
        requiredVersion: deps[dep].min_version,
      });
    }
  });
  return missingDeps;
};

const setupComponent = (component, config) => {
  logInfo(`Starting setup for component: ${component}`);
  if (config.components[component].deps != null) {
    const missingDependencies = getMissingDependencies(
      config.components[component].deps,
      config.deps
    );
    if (missingDependencies.length > 0) {
      missingDependencies.forEach((missingDependency) => {
        let errorMessage = missingDependency.installedVersion
          ? `Found ${missingDependency.name} with version ${missingDependency.installedVersion}.`
          : `Missing dependency ${missingDependency.name}.`;
        errorMessage += ` Please install ${missingDependency.name} ${missingDependency.requiredVersion} or greater`;
        logError(errorMessage);
      });
      return;
    }
  }
  if (config.components[component].setup_commands != null) {
    config.components[component].setup_commands.forEach((command) => {
      const basePath = getBasePath(
        config.CONFIG_PATH,
        config.components[component].base_directory
      );
      if (basePath) {
        const commandProcess = exec(command, { cwd: basePath });
        commandProcess.stdout.pipe(process.stdout);
        commandProcess.stderr.pipe(process.stderr);
      }
    });
  }
};

module.exports = { getBasePath, setupComponent };
