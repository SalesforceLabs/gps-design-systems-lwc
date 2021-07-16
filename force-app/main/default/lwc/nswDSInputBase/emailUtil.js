/**
 * Validate email with loose standards.
 * @param {string} value Value must be a string.
 */
 export function isValidEmail(value) {
    // Input treats all data types as string
    const normalized = `${value}`;
    // Empty is not a typeMismatch
    if (normalized === '') {
        return true;
    }
    // Only one @ symbol allowed as delimitator
    if (normalized.match(/@\S*@/) !== null) {
        return false;
    }
    // Spaces and Commas are not allowed
    if (normalized.match(/[\s,]+/) !== null) {
        return false;
    }
    // Basic let anything with content before/after an @
    return normalized.match(/^\S+@\S+$/) !== null;
}

/**
 * Validate comma deliminated emails with loose standards.
 * @param {string} value Value must be a string.
 */
export function isValidMultipleEmails(value) {
    // Input treats all data types as string
    const normalized = `${value}`;
    // Empty is not a typeMismatch
    if (normalized === '') {
        return true;
    }
    // Invalid early on multiple commas / empty
    if (normalized.match(/,\s*,/) !== null) {
        return false;
    }
    // Validate each email individually
    const emails = normalized.split(/\s*,\s*/g);
    for (let i = 0; i < emails.length; i++) {
        if (!isValidEmail(emails[i])) {
            return false;
        }
    }
    return true;
}
