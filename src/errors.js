'use strict';

/**
 * Error thrown by every SudoType API function.
 * `code` is a stable identifier you can branch on; `message` is human readable.
 */
class SudoTypeError extends Error {
  /**
   * @param {string} message
   * @param {string} [code]
   * @param {{ cause?: unknown }} [options]
   */
  constructor(message, code = 'SUDOTYPE_ERROR', options = {}) {
    super(message);
    this.name = 'SudoTypeError';
    this.code = code;
    if (options.cause !== undefined) this.cause = options.cause;
  }
}

module.exports = { SudoTypeError };
