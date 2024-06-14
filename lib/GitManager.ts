import {execSync} from "node:child_process";
import Path from "node:path";

import {Errors} from "./errors/Errors";

class GitManager {
	private static repositoryPath: string;
	private static compareBranch: string;
	private static currentBranch: string;

	/**
	 * Initialize Git manager.
	 * @param {string} path Repository path.
	 * @returns {void} Nothing.
	 * @public
	 */
	static init(path: string): void {
		this.repositoryPath = path;
		this.compareBranch = "unknown";
		this.currentBranch = "unknown";
	}

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
			throw Errors.GitManagerError(error as Error);
		}
	}

	/**
	 * Check if repository is clean.
	 * @throws {Error} Error if repository is not clean.
	 * @public
	 */
	static checkIfRepositoryIsClean(): void {
		const status = this.execCommand(`git -C "${this.repositoryPath}" status --porcelain`);
		if (status) {
			throw Errors.GitRepositoryIsNotClean();
		}
	}

	/**
	 * Fetch and pull all branches.
	 * @public
	 */
	static fetchAndPullAllBranches(): void {
		this.execCommand(`git -C "${this.repositoryPath}" fetch --all`);
		// Ensure origin/HEAD is set as commands rely on it
		this.execCommand(`git -C "${this.repositoryPath}" remote set-head origin -a || true`);
		// Avoid error if there is no upstream branch
		this.execCommand(`git -C "${this.repositoryPath}" pull --rebase || true`);
	}

	/**
	 * Get compare branch (default branch).
	 * @returns {string} Compare branch (default branch).
	 * @public
	 */
	static getCompareBranch(): string {
		if (this.compareBranch && this.compareBranch !== "unknown") {
			return this.compareBranch;
		}
		this.compareBranch = this.execCommand(
			`git -C "${this.repositoryPath}" rev-parse --abbrev-ref origin/HEAD`
		);
		if (this.compareBranch === "") {
			throw Errors.GitCompareBranchIsEmpty();
		}
		return this.compareBranch;
	}

	/**
	 * Get current branch.
	 * @returns {string} Current branch.
	 * @public
	 */
	static getCurrentBranch(): string {
		if (this.currentBranch && this.currentBranch !== "unknown") {
			return this.currentBranch;
		}
		this.currentBranch = this.execCommand(
			`git -C "${this.repositoryPath}" rev-parse --abbrev-ref HEAD`
		);
		if (this.currentBranch === "") {
			throw Errors.GitCurrentBranchIsEmpty();
		}
		return this.currentBranch;
	}

	/**
	 * Get Git relative path from Git repository.
	 * @param {string} path Absolute path.
	 * @returns {string} Relative path.
	 * @public
	 */
	static getGitRelativePath(path: string): string {
		// Remove repository path + slash from the path to get the Git relative path
		const pathReplacer = Path.join(this.repositoryPath, Path.sep);
		return path.replace(pathReplacer, "");
	}

	/**
	 * Get remote version.
	 * @param {string} path Package path.
	 * @returns {string} Remote version.
	 * @throws {Error} Error if remote version is not accessible.
	 * @public
	 */
	static getRemoteVersion(path: string): string {
		return this.execCommand(
			`git -C "${this.repositoryPath}" show "${this.getCompareBranch()}:${this.getGitRelativePath(Path.resolve(path, "package.json"))}" | jq -r '.version'`
		);
	}

	/**
	 * Get current version.
	 * @param {string} path Package path.
	 * @returns {string} Current version.
	 * @public
	 */
	static getCurrentVersion(path: string): string {
		return this.execCommand(
			`git -C "${this.repositoryPath}" show "${this.getCurrentBranch()}:${this.getGitRelativePath(Path.resolve(path, "package.json"))}" | jq -r '.version'`
		);
	}

	/**
	 * Check if package has changed.
	 * @param {string} packagePath Package path.
	 * @returns {boolean} True if package has changed.
	 * @public
	 */
	static hasPackageChanged(packagePath: string): boolean {
		// Ignore deleted files in case package has been deleted
		const changes = this.execCommand(
			`git -C "${this.repositoryPath}" diff --name-only --diff-filter=d "${this.getCompareBranch()}..${this.getCurrentBranch()}" -- '${packagePath}'`
		);
		return Boolean(changes);
	}
}

export default GitManager;

export {GitManager};
