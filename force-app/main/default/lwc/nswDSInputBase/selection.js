import { isSafari, isIE11, timeout } from 'c/nswUtilsPrivate';

/**
 * Purges the selection cache to the DOM.
 * @param input {HTMLInputElement}
 * @param cache {InputSelectionCache}
 */
function restoreCacheToInput(input, cache) {
    input.setSelectionRange(
        cache._selectionStartCached,
        cache._selectionEndCached
    );

    cache.clearCache();
}

/**
 * This class provides a way to cache text selection in input fields.
 */
export class InputSelectionCache {
    /**
     * Cached value for selectionStart
     * @type {number|null}
     */
    _selectionStartCached = null;

    /**
     * Cached value for selectionEnd
     * @type {number|null}
     */
    _selectionEndCached = null;

    /**
     * Updates the cached values.
     * @param {number} start The start of the selected range
     * @param {number} end The end of the selected range
     * @private
     */
    _cacheSelectionRange(start, end) {
        if (typeof start === 'number' && typeof end === 'number') {
            this._selectionStartCached = start;
            this._selectionEndCached = end;
        }
    }

    /**
     * Clears our cached selection.
     */
    clearCache() {
        this._selectionStartCached = null;
        this._selectionEndCached = null;
    }

    /**
     * True, if the DOM element has selection.
     * @param input {HTMLInputElement} The DOM element to operate on
     */
    hasSelection(input) {
        return (
            input.selectionStart !== null &&
            // If the start and end are the same, that's not selection, it's just the cursor position.
            input.selectionStart !== input.selectionEnd
        );
    }

    /**
     * True, if selection has been cached.
     */
    isCached() {
        return (
            this._selectionStartCached !== null &&
            this._selectionEndCached !== null
        );
    }

    /**
     * Cache the current text selection for this input field.
     * We ignore selection range of (0,0) because that indicates no selection and we don't want to restore it later.
     * @param input {HTMLInputElement} The DOM element to operate on
     */
    preserve(input) {
        if (!this.hasSelection(input) && this.isCached()) {
            // We already have cached selection but we're asking to preserve no selection,
            // so we must NOT overwrite our cache with no selection or we can't restore the previously selected text.
            // This happens if the browser doesn't preserve text selection automatically in the input.
            return;
        }

        // Only update cache if there is selection.
        if (this.hasSelection(input)) {
            this._cacheSelectionRange(input.selectionStart, input.selectionEnd);
        }
    }

    /**
     * Restore cached selection. This may happen async, so a promise is returned.
     * @param input {HTMLInputElement} The DOM element to operate on
     * @returns {Promise} A promise to be resolved when the selection is restored.
     *  If the cache was empty, the promise is resolved immediately as a no-op.
     */
    restore(input) {
        // Bail early if we don't have a cached selection.
        if (!this.isCached()) {
            return Promise.resolve();
        }

        // @W-7962838 - Safari has a browser bug where setting the selection on inputs
        // as you focus them keeps it from scrolling into view in certain conditions.
        // This can be worked around by setting the text selection in a new call stack immediately after the focus.
        // https://bugs.webkit.org/show_bug.cgi?id=217350
        if (isSafari) {
            return timeout(0).then(() => {
                // running async, so revalidate our inputs
                if (this.isCached() && input) {
                    restoreCacheToInput(input, this);
                }
            });
        }

        // W-6176985: IE11 input when set value, will move cursor to beginning.
        // This fix is only for input type=number on IE11, and force the cursor to the end.
        if (isIE11) {
            const length = input.value.length;
            input.setSelectionRange(length, length);
            return Promise.resolve();
        }

        restoreCacheToInput(input, this);
        return Promise.resolve();
    }
}
