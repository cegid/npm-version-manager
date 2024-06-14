import Fs from "node:fs";
import Path from "node:path";

import {
	beforeAll,
	afterEach,
	describe,
	expect,
	it,
	vitest,
} from "vitest";

import {Errors} from "../lib/errors/Errors";
import {VersionGenerator} from "../lib/VersionGenerator";

// To not display the log messages
vitest.mock("../lib/Logger");

const REPOSITORY_PATH = Path.resolve(__dirname, "..");

describe("VersionGenerator", () => {
	describe("getCodebaseInfos", () => {
		it("should return codebase information", () => {
			// ARRANGE
			const packageJsonPath = Path.resolve(REPOSITORY_PATH, "package.json");
			// ACT
			const codebaseInfos = VersionGenerator.getCodebaseInfos(packageJsonPath);
			// ASSERT
			expect.assertions(1);
			expect(codebaseInfos).toStrictEqual({
				checksum: expect.any(String),
			});
		});
	});

	describe("create", () => {
		let packageJsonPath: string;
		let packageJson;
		const VERSION_JSON_PATH = Path.resolve(REPOSITORY_PATH, "lib", "version.json");

		beforeAll(() => {
			packageJsonPath = Path.resolve(REPOSITORY_PATH, "package.json");
			packageJson = JSON.parse(Fs.readFileSync(packageJsonPath, {encoding: "utf8"}));
		});

		afterEach(() => {
			// Remove version.json file
			if (Fs.existsSync(VERSION_JSON_PATH)) {
				Fs.unlinkSync(VERSION_JSON_PATH);
			}
		});

		it("should create version.json file", () => {
			// ARRANGE
			const options = {
				path: REPOSITORY_PATH,
				outDir: Path.resolve(REPOSITORY_PATH, "lib"),
				debug: false,
			};
			// ACT
			const content = VersionGenerator.create(options);
			// ASSERT
			expect.assertions(2);
			expect(Fs.existsSync(VERSION_JSON_PATH)).toBe(true);
			expect(content).toStrictEqual({
				name: packageJson.name,
				version: packageJson.version,
				codebase: {
					checksum: expect.any(String),
				},
			});
		});

		it("should replace version.json file", () => {
			// ARRANGE
			const options = {
				path: REPOSITORY_PATH,
				outDir: Path.resolve(REPOSITORY_PATH, "lib"),
				debug: false,
			};
			// ACT
			// Create version.json file (first time)
			VersionGenerator.create(options);
			// Create version.json file (second time)
			const content = VersionGenerator.create(options);
			// ASSERT
			expect.assertions(2);
			expect(Fs.existsSync(VERSION_JSON_PATH)).toBe(true);
			expect(content).toStrictEqual({
				name: packageJson.name,
				version: packageJson.version,
				codebase: {
					checksum: expect.any(String),
				},
			});
		});

		it("should throw an error if the path is not a NodeJS package", () => {
			// ARRANGE
			const options = {
				path: "/path/to/nowhere",
				outDir: Path.resolve(REPOSITORY_PATH, "lib"),
				debug: false,
			};
			// ACT & ASSERT
			expect(() => VersionGenerator.create(options)).toThrow(
				Errors.PathIsNotANodeJSPackage(options.path),
			);
		});
	});
});
