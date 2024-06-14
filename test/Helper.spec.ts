import Path from "node:path";

import {
	describe,
	expect,
	it,
} from "vitest";

import Helper from "../lib/Helper";

const REPOSITORY_PATH = Path.resolve(__dirname, "..");

describe("Helper", () => {
	describe("isPathANodeJSPackage", () => {
		it("should return true if the path is a NodeJS package", () => {
			// ARRANGE & ACT
			const path = REPOSITORY_PATH;
			// ASSERT
			expect.assertions(1);
			expect(Helper.isPathANodeJSPackage(path)).toBe(true);
		});

		it("should return false if the path is not a NodeJS package", () => {
			// ARRANGE & ACT
			const path = Path.resolve(REPOSITORY_PATH, "tsconfig.json");
			// ASSERT
			expect.assertions(1);
			expect(Helper.isPathANodeJSPackage(path)).toBe(false);
		});
	});

	describe("isDirectoryToIgnore", () => {
		it("should return true if the directory should be ignored", () => {
			// ARRANGE
			const name = ".git";
			// ACT
			const path = Path.resolve(REPOSITORY_PATH, name);
			// ASSERT
			expect(Helper.isDirectoryToIgnore(name, path)).toBe(true);
		});

		it("should return false if the directory should not be ignored", () => {
			// ARRANGE
			const name = "lib";
			// ACT
			const path = Path.resolve(REPOSITORY_PATH, name);
			// ASSERT
			expect.assertions(1);
			expect(Helper.isDirectoryToIgnore(name, path)).toBe(false);
		});
	});

	describe("getPackagesPath", () => {
		it("should return an array of packages path", () => {
			// ARRANGE & ACT
			const packagesPath = Helper.getPackagesPath(REPOSITORY_PATH);
			// ASSERT
			expect.assertions(2);
			expect(Array.isArray(packagesPath)).toBe(true);
			expect(packagesPath.length).toBeGreaterThan(0);
		});
	});
});
