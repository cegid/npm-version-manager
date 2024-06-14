import {defineConfig} from "vitest/config";

export default defineConfig({
	test: {
		environment: "node",
		globals: true,
		coverage: {
			reporter: [
				"cobertura",
				"html",
				"json",
				"lcov",
				"text",
			],
			include: [
				"lib",
			],
		},
		reporters: [
			"default",
			"vitest-sonar-reporter",
		],
		outputFile: {
			"vitest-sonar-reporter": "test-report.xml",
		},
		// @ts-expect-error - vite doesn't know about this option
		sonarReporterOptions: {silent: true},
	},
});
