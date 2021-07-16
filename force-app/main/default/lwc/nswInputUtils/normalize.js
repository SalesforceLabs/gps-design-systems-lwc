import { normalizeString } from 'c/nswUtilsPrivate';

export const VARIANT = {
    STANDARD: 'standard',
    LABEL_HIDDEN: 'label-hidden',
    LABEL_STACKED: 'label-stacked',
    LABEL_INLINE: 'label-inline',
};

/**
A variant normalization utility for attributes.
@param {Any} value - The value to normalize.
@return {Boolean} - The normalized value.
**/
export function normalizeVariant(value) {
    return normalizeString(value, {
        fallbackValue: VARIANT.STANDARD,
        validValues: [
            VARIANT.STANDARD,
            VARIANT.LABEL_HIDDEN,
            VARIANT.LABEL_STACKED,
            VARIANT.LABEL_INLINE,
        ],
    });
}
