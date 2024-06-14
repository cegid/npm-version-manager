import {
	ArgumentsCamelCase,
	CommandBuilder,
} from "yargs";

import {Errors} from "../errors/Errors";
import {Logger} from "../Logger";
import {VersionManager} from "../VersionManager";

export enum BumpType {
	MAJOR = "major", // 2.0.0
	MINOR = "minor", // 1.1.0
	PATCH = "patch", // 1.0.1
	PRE_MAJOR = "premajor", // 2.0.0-alpha.0
	PRE_MINOR = "preminor", // 1.1.0-alpha.0
	PRE_PATCH = "prepatch", // 1.0.1-alpha.0
	PRE_RELEASE = "prerelease", // 1.0.1-alpha.0, 1.0.1-alpha.1, 1.0.1-alpha.2, ...
}

const bumpTypeValues = Object.values(BumpType);

export type Options = {
	// Mandatory
	type?: BumpType;
	// Optional
	// Packages to bump version
	all?: boolean;
	packages?: boolean;
	repository?: boolean;
	updated: boolean;
	// Branch comparison
	fromCurrent?: boolean;
	fromRemote?: boolean;
	// General
	debug: boolean;
};

/**
 * Show options
 * @param {Options} options Options
 * @returns {void} Nothing
 */
const showOptions = (options: Options): void => {
	Logger.log("\nOptions:");
	Object.entries(options).forEach(([key, value]) => {
		Logger.log(`- ${key}: ${value}`);
	});
};

export const command: string = "bump [type]";

export const describe: string = "Bump version number in package.json files";

export const builder: CommandBuilder<Options, Options> = (yargs) => {
	return yargs
		// Mandatory
		.positional("type", {
			description: `Bump type (${bumpTypeValues.join(" | ")})`,
			type: "string",
			choices: bumpTypeValues,
		})
		// Optional
		// Packages to bump version
		.option("all", {
			alias: "a",
			type: "boolean",
			description: "Bump version in repository and all packages",
			conflicts: ["packages", "repository"],
		})
		.option("packages", {
			alias: "p",
			type: "boolean",
			description: "Bump version in all packages (repository excluded)",
			conflicts: ["all"],
		})
		.option("repository", {
			alias: "r",
			type: "boolean",
			description: "Bump version in repository",
			conflicts: ["all"],
		})
		.option("updated", {
			alias: "u",
			type: "boolean",
			description: "Bump version if updated",
			default: false,
		})
		// Branch comparison
		.option("from-current", {
			alias: "fc",
			type: "boolean",
			description: "Bump version based on current version",
			conflicts: ["from-remote"],
		})
		.option("from-remote", {
			alias: "fr",
			type: "boolean",
			description: "Bump version based on remote version",
			conflicts: ["from-current"],
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
		// Mandatory
		type: args.type,
		// Optional
		// Packages to bump version
		all: args.all ?? false,
		packages: args.packages ?? false,
		repository: args.repository ?? false,
		updated: args.updated,
		// Branch comparison
		fromCurrent: args.fromCurrent ?? false,
		fromRemote: args.fromRemote ?? false,
		// General
		debug: args.debug,
	};

	// Debug mode
	if (options.debug) {
		Logger.setDebugMode(true);
		Logger.warn("Debug mode (--debug).");
	}

	// If none of the two options are true, default to bump version from remote version
	if (!options.fromCurrent && !options.fromRemote) {
		Logger.warn(
			"Default to bump version from remote version. " +
			"No option selected (--from-remote or --from-current)."
		);
		options.fromRemote = true;
	}

	// Show options
	showOptions(options);

	// At least one of the options is required
	if (!options.all && !options.packages && !options.repository) {
		throw Errors.CLIAtLeastOneOfOptionsIsRequired(["--all", "--packages", "--repository"]);
	}

	// Bump version
	VersionManager.bump(options);
};
