#!/usr/bin/env node

import Yargs from "yargs/yargs";
import {hideBin} from "yargs/helpers";

import {ApplicationError} from "./errors/ApplicationError";

import {Errors} from "./errors/Errors";
import {Logger} from "./Logger";

import {name, version} from "./version.json";

Logger.info(`Library: ${name}`);
Logger.info(`Version: ${version}`);

/**
 * CLI
 */
try {
	Yargs(hideBin(process.argv))
		.alias("h", "help")
		.alias("v", "version")
		.commandDir("commands")
		.strictCommands() // Show help if unrecognized commands
		.demandCommand(1) // Show help
		.locale("en")
		.parse();
} catch (error) {
	Errors.handleError(error as ApplicationError);
}
