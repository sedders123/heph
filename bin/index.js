#!/usr/bin/env node
const pckg = require("../package.json");
const program = require("commander");
const { up, dump } = require("../lib/commands");
let { setVerbosityLevel } = require("../lib/config");

function increaseVerbosity(dummyValue, previous) {
  return previous + 1;
}

program.version(pckg.version);
program.option(
  "-v, --verbose",
  "verbosity that can be increased",
  increaseVerbosity,
  0
);
program.on("option:verbose", function () {
  process.env.VERBOSE = setVerbosityLevel(program.verbose);
});

program.program.command("up").description("Run the setup steps").action(up);

program.program
  .command("dump")
  .description("Dump current heph configuration")
  .action(dump);

program.parse(process.argv);
