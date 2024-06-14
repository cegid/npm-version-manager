import {v4 as uuidV4} from "uuid";
import ApplicationErrorSummary from "./ApplicationErrorSummary";

/**
 * Base error for applications, an application error means application couldn't perform the requested operation
 * @version 1.0.0
 */
class ApplicationError extends Error {
	/**
	 * Code for the error, identifies the kind of error that occurred
	 * @type {string}
	 */
	readonly code: string;

	/**
	 * Inner error if any
	 * @type {Error}
	 */
	readonly error?: Error;

	/**
	 * Error occurrence identifier, globally unique
	 * @type {string}
	 */
	readonly id: string;

	/**
	 * Unique constructor
	 * @param {string} code The unique ApplicationError identification code.
	 * @param {string} message The message of the ApplicationError.
	 * @param {Error} error The original error if any.
	 */
	constructor(code: string, message: string, error?: Error) {
		super(message);
		this.code = code;
		this.error = error;
		this.id = uuidV4();
		this.name = `${this.constructor.name}[${code}]`;
	}

	/**
	 * Returns a short representation of the error to be used as a payload for http responses.
	 * @returns {ApplicationErrorSummary} A short representation of the error.
	 */
	summarize(): ApplicationErrorSummary {
		return new ApplicationErrorSummary(
			this.id,
			this.constructor.name,
			this.code,
			this.message,
		);
	}
}

// Default export
export default ApplicationError;

export {ApplicationError};
