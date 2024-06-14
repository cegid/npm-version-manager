const jestConfig = {
	rootDir: "./",
	roots: ["<rootDir>"],
	testPathIgnorePatterns: [
		// Exclude generated coverage folder
		"<rootDir>/coverage/",
	],
	modulePaths: [],
	transform: {
		"^.+\\.[jt]sx?$": "babel-jest",
	},
	testRegex: [
		"^.+/test/.+\\.spec\\.[jt]sx?$",
		"^.+/test/features/step_definitions/.+\\.steps\\.[jt]sx?$",
	],
	moduleFileExtensions: [
		"js",
		"json",
		"jsx",
		"min.js",
		"ts",
		"tsx",
	],
	coverageReporters: [
		"cobertura",
		"json",
		"html",
		"text",
		"lcov",
	],
	reporters: [
		"default",
		[
			"jest-junit",
			{
				suiteName: "Jest unit tests",
				outputDirectory: ".",
				outputName: "junit.xml",
				uniqueOutputName: "false",
				classNameTemplate: "{classname}-{title}",
				titleTemplate: "{classname}-{title}",
				ancestorSeparator: " › ",
				usePathForSuiteName: "true",
			},
		],
	],
	testEnvironment: "node",
	testResultsProcessor: "jest-sonar-reporter",
	passWithNoTests: true,
	clearMocks: true,
};

const isCI = process.argv.some((_arg) => _arg === "--ci" || _arg === "--coverage");
if (isCI) {
	jestConfig.collectCoverage = true;
	jestConfig.collectCoverageFrom = [
		"**/*.{js,jsx,ts,tsx}",
		// Configuration files in <rootDir
		"!./babel.config.js",
		"!./jest.config.js",
		// Ignore global
		"!**/node_modules/**",
		"!**/coverage/**",
		"!**/dist/**",
		"!**/test/**",
		"!**/vendor/**",
		// Ignore those TS files
		"!**/*.interface.ts",
		"!**/*.mock.ts",
		"!**/*.module.ts",
		"!**/*.spec.ts",
		"!**/*.test.ts",
		"!**/*.d.ts",
		// Interfaces + exports
		"!./lib/types.ts",
		"!./lib/index.ts",
	];
}

module.exports = jestConfig;
