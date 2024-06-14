import CLC from "cli-color";

const {log} = console;

class Logger {
	private static debugMode: boolean = false;

	/**
	 * Get debug mode.
	 * @returns {boolean} Debug mode.
	 */
	static getDebugMode(): boolean {
		return this.debugMode;
	}

	/**
	 * Set debug mode.
	 * @param {boolean} debugMode Debug mode.
	 */
	static setDebugMode(debugMode: boolean) {
		this.debugMode = debugMode;
	}

	/**
	 * Display message.
	 * No color.
	 * @param {string} message Message to display.
	 */
	static log(message: string) {
		log(message);
	}

	/**
	 * Display debug message.
	 * No color.
	 * @param {string} message Message to display.
	 */
	static debug(message: string) {
		this.debugMode && this.log(message);
	}

	/**
	 * Display info message.
	 * Blue color.
	 * @param {string} message Message to display.
	 */
	static info(message: string) {
		this.log(CLC.blue(message));
	}

	/**
	 * Display info message in green (success or to emphasise).
	 * Green color.
	 * @param {string} message Message to display.
	 */
	static infoGreen(message: string) {
		this.log(CLC.green(message));
	}

	/**
	 * Display warning message.
	 * Yellow color.
	 * @param {string} message Message to display.
	 */
	static warn(message: string) {
		this.log(CLC.yellow(message));
	}

	/**
	 * Display error message.
	 * Red color.
	 * @param {string} message Message to display.
	 */
	static error(message: string) {
		this.log(CLC.red(message));
	}
}

export default Logger;

export {Logger};
