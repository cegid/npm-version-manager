import {ApplicationError} from "./ApplicationError";

import {Logger} from "../Logger";

const ErrorCodes = {
	CannotGenerateChecksumOfPackageJsonFile: "CannotGenerateChecksumOfPackageJsonFile",
	CurrentDirectoryIsNotAGitRepository: "CurrentDirectoryIsNotAGitRepository",
	CLIAtLeastOneOfOptionsIsRequired: "CLIAtLeastOneOfOptionsIsRequired",
	GitManagerError: "GitManagerError",
	GitCompareBranchIsEmpty: "GitCompareBranchIsEmpty",
	GitCurrentBranchIsEmpty: "GitCurrentBranchIsEmpty",
	GitRepositoryIsNotClean: "GitRepositoryIsNotClean",
	NpmManagerError: "NpmManagerError",
	PathIsNotANodeJSPackage: "PathIsNotANodeJSPackage",
	PathDoesNotExist: "PathDoesNotExist",
};
const ErrorCodesValues = Object.values(ErrorCodes);

class Errors {
	/**
	 * Handle errors
	 * @param {ApplicationError} error The error to handle
	 * @returns {void} Nothing.
	 * @public
	 */
	static handleError(error: ApplicationError) {
		if (ErrorCodesValues.includes(error.code)) {
			if (error.error) {
				// Log the message and stack
				Logger.error(`\n${error.message}\n\n${error.error.stack}\n`);
			} else {
				// Log the message
				Logger.error(`\n${error.message}\n`);
			}
		} else {
			// Unknown error (need to be categorized)
			Logger.error(`\nUnknown error:\n${error.stack}\n`);
		}
		// Exit with error code
		process.exitCode = 1;
	}

	static CannotGenerateChecksumOfPackageJsonFile() {
		return new ApplicationError(
			ErrorCodes.CannotGenerateChecksumOfPackageJsonFile,
			"Cannot generate checksum of package.json file.",
		);
	}

	static CurrentDirectoryIsNotAGitRepository(path: string) {
		return new ApplicationError(
			ErrorCodes.CurrentDirectoryIsNotAGitRepository,
			`${path} is not a Git repository.\nPlease run this command in a Git repository.`,
		);
	}

	static CLIAtLeastOneOfOptionsIsRequired(_options: string[]) {
		return new ApplicationError(
			ErrorCodes.CLIAtLeastOneOfOptionsIsRequired,
			`Exactly one of the arguments ${_options.join(", ")} is required`,
		);
	}

	static GitManagerError(error: Error) {
		return new ApplicationError(
			ErrorCodes.GitManagerError,
			`An error occurred in GitManager: ${error.message}`,
			error,
		);
	}

	static GitCompareBranchIsEmpty() {
		return new ApplicationError(
			ErrorCodes.GitCompareBranchIsEmpty,
			"Compare branch is empty!",
		);
	}

	static GitCurrentBranchIsEmpty() {
		return new ApplicationError(
			ErrorCodes.GitCurrentBranchIsEmpty,
			"Current branch is empty!",
		);
	}

	static GitRepositoryIsNotClean() {
		return new ApplicationError(
			ErrorCodes.GitRepositoryIsNotClean,
			"The Git repository is not clean. Please commit or stash your changes and try again.",
		);
	}

	static NpmManagerError(error: Error) {
		return new ApplicationError(
			ErrorCodes.NpmManagerError,
			`An error occurred in NpmManager: ${error.message}`,
			error,
		);
	}

	static PathIsNotANodeJSPackage(path: string) {
		return new ApplicationError(
			ErrorCodes.PathIsNotANodeJSPackage,
			`Path ${path} is not a NodeJS package!`,
		);
	}

	static PathDoesNotExist(path: string) {
		return new ApplicationError(
			ErrorCodes.PathDoesNotExist,
			`Path ${path} does not exist!`,
		);
	}
}

export default {Errors, ErrorCodes};

export {Errors, ErrorCodes};
