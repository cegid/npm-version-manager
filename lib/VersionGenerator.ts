import ChildProcess from "node:child_process";
import Fs from "node:fs";
import Path from "node:path";

import {Options} from "./commands/generate";
import {Errors} from "./errors/Errors";
import {Helper} from "./Helper";
import {Logger} from "./Logger";

type CodebaseInfos = {
	checksum: string;
};

type VersionJSONContent = {
	name: string;
	version: string;
	codebase: CodebaseInfos;
};

class VersionGenerator {
	/**
	 * Returns codebase information.
	 * Does not include author because of GDPR.
	 * Does not include commit message to not reveal information.
	 * @param {string} path Path to package.json file.
	 * @returns {CodebaseInfos} Codebase infos.
	 * @private
	 */
	static getCodebaseInfos(path: string): CodebaseInfos {
		// Checksum
		Logger.log(`Computing checksum of ${path}...`);
		const bufferChecksum = ChildProcess.execSync(`sha256sum ${path}`);
		const checksum = bufferChecksum.toString()
			.replace(new RegExp(`\\s+${path}`, "g"), "")
			.replace(/\r?\n/, "");

		if (!checksum) {
			throw Errors.CannotGenerateChecksumOfPackageJsonFile();
		}

		return {
			checksum,
		};
	}

	/**
	 * Create version.json file.
	 * @param {Options} options Options.
	 * @returns {VersionJSONContent} File content.
	 * @public
	 */
	static create(options: Options): VersionJSONContent {
		// Check if path is a NodeJS package (existence of package.json file)
		if (!Helper.isPathANodeJSPackage(options.path)) {
			throw Errors.PathIsNotANodeJSPackage(options.path);
		}

		const packageJsonPath = Path.resolve(options.path, "package.json");
		const versionJsonPath = Path.resolve(options.outDir, "version.json");

		// Replace current version.json with a new one
		if (Fs.existsSync(versionJsonPath)) {
			Logger.warn("\nReplacing version.json...");
			Fs.unlinkSync(versionJsonPath);
		}

		Logger.log("\nCreating version.json file...");
		// Read package.json file
		const packageJson = JSON.parse(Fs.readFileSync(packageJsonPath, {encoding: "utf8"}));
		// Create version.json file
		const content: VersionJSONContent = {
			name: packageJson.name,
			version: packageJson.version,
			codebase: this.getCodebaseInfos(packageJsonPath),
		};
		const contentStr = `${JSON.stringify(content, null, "\t")}\n`;
		Fs.writeFileSync(versionJsonPath, contentStr, {encoding: "utf8"});

		// Log success message
		Logger.infoGreen(`\nThe version.json file has been created in ${versionJsonPath}\n`);

		// Log content if debug mode is enabled
		Logger.debug(contentStr);

		return content;
	}
}

export default VersionGenerator;

export {VersionGenerator};
