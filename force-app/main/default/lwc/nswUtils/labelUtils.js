/**
 * Takes label strings with placeholder params (`{0}`) and updates the label with given `args`
 * @param {string} str - any label string requiring injections of other strings/params (e.g., 'foo {0}')
 * @param  {string|array} arguments - string(s) to be injected into the `string` param
 * @returns {string} fully replaced string, e.g., '{0} is a {1}' -> 'Hal Jordan is a Green Lantern'
 */

export function formatLabel(str) {
    const args = Array.prototype.slice.call(arguments, 1);
    let replacements = args;
    if (Array.isArray(args[0])) {
        [replacements] = args;
    }

    return str.replace(/{(\d+)}/g, (match, i) => {
        return replacements[i];
    });
}
