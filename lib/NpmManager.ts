import {execSync} from "node:child_process";

import {BumpType} from "./commands/bump";
import {Errors} from "./errors/Errors";

class NpmManager {
	/**
	 * Execute command.
	 * @param {string} command Command to execute.
	 * @returns {string} Command output.
	 * @private
	 */
	static execCommand(command: string): string {
		try {
			return execSync(command)
				.toString()
				.trim();
		} catch (error) {
			throw Errors.NpmManagerError(error as Error);
		}
	}

	/**
	 * Bump version with the remote version.
	 * @param {string} packagePath Package path.
	 * @param {string} remoteVersion Remote version.
	 * @returns {string} Bumped version.
	 * @public
	 */
	static bumpRemoteVersion(packagePath: string, remoteVersion: string): string {
		return this.execCommand(
			`npm --prefix "${packagePath}" version "${remoteVersion}" --no-git-tag-version --allow-same-version > /dev/null`
		);
	}

	/**
	 * Bump version.
	 * @param {string} packagePath Package path.
	 * @param {BumpType} bumpType Bump type.
	 * @returns {string} Bumped version.
	 * @public
	 */
	static bumpVersion(packagePath: string, bumpType: BumpType): string {
		const nextVersion = bumpType.toString();
		return this.execCommand(
			`npm --prefix "${packagePath}" version "${nextVersion}" --preid=alpha --no-git-tag-version --allow-same-version`
		);
	}
}

export default NpmManager;

export {NpmManager};
