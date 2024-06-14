/**
 * Summary of an error, to be used as a payload when transmitting the error
 */
class ApplicationErrorSummary {
	/**
	 * Code for the error, identifies the type of error that occurred
	 * @type {string}
	 */
	readonly code: string;

	/**
	 * Error occurrence identifier, globally unique
	 * @type {string}
	 */
	readonly id: string;

	/**
	 * Error message
	 * @type {string}
	 */
	readonly message: string;

	/**
	 * Kind of the error
	 * @type {string}
	 */
	readonly kind: string;

	/**
	 * Constructor
	 * @param {string} id Unique id of the error occurrence
	 * @param {string} kind Kind (class) of the error
	 * @param {string} code Error identifier
	 * @param {string} message Error message
	 */
	constructor(id: string, kind: string, code: string, message: string) {
		this.id = id;
		this.kind = kind;
		this.code = code;
		this.message = message;
	}
}

// Default export
export default ApplicationErrorSummary;

export {ApplicationErrorSummary};
