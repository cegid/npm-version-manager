import Fs from "node:fs";
import Path from "node:path";
import Process from "node:process";

import {
	ArgumentsCamelCase,
	CommandBuilder,
} from "yargs";

import {Errors} from "../errors/Errors";
import {Logger} from "../Logger";
import {VersionGenerator} from "../VersionGenerator";

export type Options = {
	// Optional
	path: string;
	outDir: string;
	// General
	debug: boolean;
};

/**
 * Show options
 * @param {Options} options Options
 * @returns {void} Nothing
 */
const showOptions = (options: Options): void => {
	Logger.log(`${Logger.getDebugMode() ? "\n" : ""}Options:`);
	Object.entries(options).forEach(([key, value]) => {
		Logger.log(`- ${key}: ${value}`);
	});
};

export const command: string = "generate";

export const describe: string = "Generate a version.json file with the version and the name of a package";

export const builder: CommandBuilder<Options, Options> = (yargs) => {
	return yargs
		// Optional
		.option("path", {
			alias: "p",
			description: "Path to the package directory",
			type: "string",
			default: Process.cwd(),
		})
		.option("outDir", {
			alias: "o",
			description: "Output directory for the version.json file",
			type: "string",
			default: Process.cwd(),
		})
		// General
		.option("debug", {
			alias: "d",
			type: "boolean",
			description: "Debug mode",
			default: false,
		});
};

export const handler = (args: ArgumentsCamelCase<Options>): void => {
	const options: Options = {
		// Optional
		path: args.path,
		outDir: args.outDir,
		// General
		debug: args.debug,
	};

	// Debug mode
	if (options.debug) {
		Logger.setDebugMode(true);
		Logger.warn("Debug mode (--debug).");
	}

	Logger.debug("Ensure path exists and is absolute");
	// Ensure path is absolute
	options.path = Path.resolve(options.path);
	// Check path exists
	if (!Fs.existsSync(options.path)) {
		throw Errors.PathDoesNotExist(options.path);
	}

	Logger.debug("Ensure output directory exists and is absolute");
	// Ensure path is absolute
	options.outDir = Path.resolve(options.outDir);
	// Check path exists
	if (!Fs.existsSync(options.outDir)) {
		throw Errors.PathDoesNotExist(options.outDir);
	}

	// Show options
	showOptions(options);

	// Bump version
	VersionGenerator.create(options);
};
