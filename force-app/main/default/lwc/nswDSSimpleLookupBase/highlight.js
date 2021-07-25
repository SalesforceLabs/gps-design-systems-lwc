export function toHighlightParts(text, matchedSubstrings) {
    text = text || '';
    matchedSubstrings = matchedSubstrings || [];
    const parts = [];
    let last = 0;
    let index = 0;
    while (last < text.length && index < matchedSubstrings.length) {
        const part = matchedSubstrings[index++];

        if (part.offset > last) {
            parts.push({
                text: text.substring(last, part.offset),
                highlight: false,
            });
        }

        last = part.offset + part.length;
        parts.push({
            text: text.substring(part.offset, last),
            highlight: true,
        });
    }

    if (last < text.length) {
        parts.push({
            text: text.substring(last),
            highlight: false,
        });
    }
    return parts;
}
