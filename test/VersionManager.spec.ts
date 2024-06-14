import Path from "node:path";
import Process from "node:process";

import {
	beforeEach,
	afterEach,
	describe,
	expect,
	it,
	vitest,
} from "vitest";

import {Errors} from "../lib/errors/Errors";
import {GitManager} from "../lib/GitManager";
import {NpmManager} from "../lib/NpmManager";
import {VersionManager} from "../lib/VersionManager";
import {BumpType, Options} from "../lib/commands/bump";
import Logger from "../lib/Logger";

vitest.mock("../lib/GitManager");
vitest.mock("../lib/NpmManager");
// To not display the log messages
vitest.mock("../lib/Logger");

const REPOSITORY_PATH = Path.resolve(__dirname, "..");

describe("VersionManager", () => {
	beforeEach(() => {
		GitManager.init(REPOSITORY_PATH);
	});

	afterEach(() => {
		vitest.resetAllMocks();
		vitest.restoreAllMocks();
	});

	describe("bumpPackage", () => {
		let options: Options;

		beforeEach(() => {
			// Common options setup for each test
			options = {
				type: BumpType.PATCH,
				all: false,
				repository: false,
				fromRemote: false,
				fromCurrent: true,
				updated: false,
				debug: false,
			};
		});

		it("should bump package version number", () => {
			// ACT
			VersionManager.bumpPackage(REPOSITORY_PATH, options);

			// ASSERT
			expect.assertions(4);
			expect(GitManager.getCurrentVersion).toHaveBeenCalledTimes(1);
			expect(GitManager.getRemoteVersion).toHaveBeenCalledTimes(0);
			expect(NpmManager.bumpRemoteVersion).toHaveBeenCalledTimes(0);
			expect(NpmManager.bumpVersion).toHaveBeenCalledTimes(1);
		});

		it("should log info about bumping version from current", () => {
			// ARRANGE
			const expectedLogMessage = "Bumping the version number for: npm-version-manager (from current)";

			// ACT
			VersionManager.bumpPackage(REPOSITORY_PATH, options);

			// ASSERT
			expect.assertions(1);
			expect(Logger.info).toHaveBeenCalledWith(expectedLogMessage);
		});

		it("should log info about bumping version from remote", () => {
			// ARRANGE
			options.fromRemote = true;
			options.fromCurrent = false;
			const expectedLogMessage = "Bumping the version number for: npm-version-manager (from remote)";

			// ACT
			VersionManager.bumpPackage(REPOSITORY_PATH, options);

			// ASSERT
			expect.assertions(1);
			expect(Logger.info).toHaveBeenCalledWith(expectedLogMessage);
		});

		it("should warn if no remote version found", () => {
			// ARRANGE
			options.fromRemote = true;
			options.fromCurrent = false;
			vitest.mocked(GitManager.getRemoteVersion).mockImplementationOnce(() => {
				throw new Error("fatal: the path 'package.json' exists on disk, but not in 'origin/master'.");
			});
			const expectedWarnMessage = "No remote version found.";

			// ACT
			VersionManager.bumpPackage(REPOSITORY_PATH, options);

			// ASSERT
			expect.assertions(1);
			expect(Logger.warn).toHaveBeenCalledWith(expectedWarnMessage);
		});

		it("should bump version based on remote version", () => {
			// ARRANGE
			options.fromRemote = true;
			options.fromCurrent = false;
			vitest.mocked(GitManager.getRemoteVersion).mockReturnValueOnce("1.0.0");

			// ACT
			VersionManager.bumpPackage(REPOSITORY_PATH, options);

			// ASSERT
			expect.assertions(2);
			expect(NpmManager.bumpRemoteVersion).toHaveBeenCalledTimes(1);
			expect(NpmManager.bumpVersion).toHaveBeenCalledTimes(1);
		});

		it("should log version bump success message", () => {
			// ARRANGE
			const currentVersion = "1.0.0";
			const bumpedVersion = "1.0.1";
			vitest.mocked(GitManager.getCurrentVersion).mockReturnValueOnce(currentVersion);
			vitest.mocked(NpmManager.bumpVersion).mockReturnValueOnce(bumpedVersion);
			const expectedSuccessMessage = `${currentVersion} --> ${bumpedVersion}`;

			// ACT
			VersionManager.bumpPackage(REPOSITORY_PATH, options);

			// ASSERT
			expect.assertions(1);
			expect(Logger.infoGreen).toHaveBeenCalledWith(expectedSuccessMessage);
		});

		it("should log ahead of remote version if versions match", () => {
			// ARRANGE
			const version = "1.0.0";
			vitest.mocked(GitManager.getCurrentVersion).mockReturnValueOnce(version);
			vitest.mocked(NpmManager.bumpVersion).mockReturnValueOnce(version);
			const expectedMessage = "Ahead of remote version.";

			// ACT
			VersionManager.bumpPackage(REPOSITORY_PATH, options);

			// ASSERT
			expect.assertions(1);
			expect(Logger.infoGreen).toHaveBeenCalledWith(expectedMessage);
		});

		it("should not throw an error if the remote is not accessible", () => {
			// ARRANGE
			options.fromRemote = true;
			options.fromCurrent = false;
			const expectedErrorMessage = "fatal: the path 'package.json' exists on disk, but not in 'origin/master'.";
			vitest.mocked(GitManager.getRemoteVersion).mockImplementationOnce(() => {
				throw new Error(expectedErrorMessage);
			});

			// ACT & ASSERT
			expect.assertions(1);
			expect(() => VersionManager.bumpPackage(REPOSITORY_PATH, options)).not.toThrow(expectedErrorMessage);
		});
	});

	describe("bump", () => {
		let options: Options;

		beforeEach(() => {
			options = {
				type: BumpType.PATCH,
				all: true,
				repository: true,
				fromRemote: true,
				updated: false,
				debug: false,
			};
		});

		it("should bump version number", () => {
			// ARRANGE & ACT
			VersionManager.bump(options);

			// ASSERT
			expect.assertions(4);
			expect(GitManager.checkIfRepositoryIsClean).toHaveBeenCalledTimes(1);
			expect(GitManager.fetchAndPullAllBranches).toHaveBeenCalledTimes(1);
			expect(GitManager.getCompareBranch).toHaveBeenCalledTimes(1);
			expect(GitManager.getCurrentBranch).toHaveBeenCalledTimes(1);
		});

		it("should throw an error if the current directory is not a Git repository", () => {
			// ARRANGE
			const path = "/path/to/nowhere";
			const spyProcessCwd = vitest.spyOn(Process, "cwd").mockReturnValue(path);

			// ACT & ASSERT
			expect.assertions(2);
			expect(() => {
				VersionManager.bump(options);
			}).toThrow(Errors.CurrentDirectoryIsNotAGitRepository(path));
			expect(spyProcessCwd).toHaveBeenCalledTimes(1);

			// Cleanup
			spyProcessCwd.mockRestore();
		});
	});
});
