import Fs from "node:fs";
import Path from "node:path";

class Helper {
	static readonly PATHS_TO_IGNORE = [
		new RegExp(Path.join("client", "desktop", "ext-")),
		new RegExp(Path.join("client", "desktop", "react", "lib")),
		new RegExp(Path.join("test", "integration")),
	];
	static readonly DIRECTORIES_TO_IGNORE = [
		".git",
		"coverage",
		"dist",
		"megalinter-reports",
		"node_modules",
	];

	/**
	 * Checks if path is a NodeJS package.
	 * @param {string} path Path to check.
	 * @returns {boolean} True if path is a NodeJS package.
	 * @private
	 */
	static isPathANodeJSPackage(path: string): boolean {
		const packageJsonPath = Path.resolve(path, "package.json");
		return Fs.existsSync(packageJsonPath);
	}

	/**
	 * Checks if the directory should be ignored based one its name or its path.
	 * @param {string} name Directory name.
	 * @param {string} path Directory path.
	 * @returns {boolean} True if directory should be ignored.
	 * @private
	 */
	static isDirectoryToIgnore(name: string, path: string): boolean {
		return this.DIRECTORIES_TO_IGNORE.includes(name) ||
			this.PATHS_TO_IGNORE.some((pathToIgnore) => pathToIgnore.exec(path) !== null);
	}

	/**
	 * Get packages path.
	 * @param {string} path Path to check.
	 * @returns {string[]} Packages path.
	 */
	static getPackagesPath(path: string): string[] {
		const dirContent = Fs.readdirSync(path, {encoding: "utf8", withFileTypes: true});
		return dirContent
			.reduce((packages: string[], dirent) => {
				const dirPath = Path.resolve(dirent.path, dirent.name);
				// Check if element is a file and its name is package.json
				if (dirent.isFile() && dirent.name === "package.json") {
					return packages.concat(dirent.path);
				// Check if element is a directory
				} else if (dirent.isDirectory() && !this.isDirectoryToIgnore(dirent.name, dirPath)) {
					return packages.concat(this.getPackagesPath(dirPath));
				// Do nothing
				} else {
					return packages;
				}
			}, [])
			// Sort by number of slashes
			.sort((pathA, pathB) => pathA.split("/").length - pathB.split("/").length);
	}
}

export default Helper;

export {Helper};
