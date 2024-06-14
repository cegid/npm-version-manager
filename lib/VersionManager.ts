import Fs from "node:fs";
import Path from "node:path";
import Process from "node:process";

import {BumpType, Options} from "./commands/bump";
import {Errors} from "./errors/Errors";
import {GitManager} from "./GitManager";
import {Helper} from "./Helper";
import {Logger} from "./Logger";
import {NpmManager} from "./NpmManager";

class VersionManager {
	/**
	 * Bump package version number.
	 * @param {string} packagePath Package path.
	 * @param {Options} options Options.
	 * @returns {string} Bumped version number.
	 * @private
	 */
	static bumpPackage(
		packagePath: string,
		options: Options,
	): string {
		const contextFrom = options.fromRemote && !options.fromCurrent
			? "from remote"
			: "from current";
		Logger.info(`Bumping the version number for: ${Path.basename(packagePath)} (${contextFrom})`);

		const currentVersion = GitManager.getCurrentVersion(packagePath);

		if (options.fromRemote && !options.fromCurrent) {
			try {
				// Get the version number from remote repository
				const remoteVersion = GitManager.getRemoteVersion(packagePath);

				// Hack to set back the version to remote
				NpmManager.bumpRemoteVersion(packagePath, remoteVersion);
			} catch {
				Logger.warn("No remote version found.");
				return currentVersion;
			}
		}
		// Bump the version number based on remote version
		const bumpedVersion = NpmManager.bumpVersion(packagePath, options.type as BumpType);
		Logger.infoGreen(currentVersion === bumpedVersion
			? "Ahead of remote version."
			: `${currentVersion} --> ${bumpedVersion}`);
		return bumpedVersion;
	}

	/**
	 * Bump version number.
	 * @param {Options} options Options.
	 * @returns {void} Nothing.
	 * @public
	 */
	static bump(options: Options): void {
		const path = Process.cwd();
		const gitPath = Path.resolve(path, ".git");
		// Check if current directory is a Git repository
		if (!Fs.existsSync(gitPath)) {
			throw Errors.CurrentDirectoryIsNotAGitRepository(path);
		} else {
			Logger.info(`\nCurrent directory: ${path}`);
		}

		GitManager.init(path);

		// Check if the Git repository is cleaned
		Logger.log("\nChecking if the repository is cleaned...");
		GitManager.checkIfRepositoryIsClean();

		// Retrieve all packages path
		const packagesPath = Helper.getPackagesPath(path)
			.filter((packagePath) => {
				const isIncluded =
					// Include repository and packages
					options.all ||
					// Include repository
					(options.repository && packagePath === path) ||
					// Include packages
					(options.packages && packagePath !== path);
				// If updated option is true, check if package has changed
				return options.updated
					? isIncluded && GitManager.hasPackageChanged(packagePath)
					: isIncluded;
			});

		// Check if there are packages to bump version number
		if (packagesPath.length === 0) {
			Logger.warn("\nNo packages to bump version number.\n");
		} else {
			// Show packages path (debug mode)
			Logger.debug(`\nPackages path:\n${packagesPath.toString()
				.split(",")
				.join("\n")}`);

			// Do the necessary to have repository up-to-date
			Logger.log("\nFetching and pulling the latest changes from the remote repository...");
			GitManager.fetchAndPullAllBranches();

			// Get compare branch (default branch) and current branch
			const compareBranch = GitManager.getCompareBranch();
			Logger.info(`\nCompare branch: ${compareBranch}`);
			const currentBranch = GitManager.getCurrentBranch();
			Logger.info(`Current branch: ${currentBranch}`);

			Logger.log("\nBumping version number...\n");
			packagesPath.forEach((packagePath) => this.bumpPackage(packagePath, options));
			Logger.infoGreen("\nBump version number done!\n");
		}
	}
}

export default VersionManager;

export {VersionManager};
