const RESIZE_OBSERVER = Symbol("_resizeObserver");
const HANDLE_RESIZE_HEIGHT = Symbol("_handleResizeHeight");
export default function ResizeHeightMixin(base, resizeRef) {
    // @ts-ignore
    return class ResizeHeightMixin extends base {
        [RESIZE_OBSERVER];
        [HANDLE_RESIZE_HEIGHT];
        renderedCallback() {
            super.renderedCallback();
            if (!this[RESIZE_OBSERVER]) {
                this[RESIZE_OBSERVER] = new ResizeObserver((entries) => {
                    /* eslint-disable-next-line @lwc/lwc/no-async-operation */
                    window.requestAnimationFrame(() => {
                        if (this[HANDLE_RESIZE_HEIGHT])
                            this[HANDLE_RESIZE_HEIGHT](entries[0].contentRect.height);
                    });
                });
                // @ts-ignore
                const ref = this.refs[resizeRef];
                if (ref) {
                    this[RESIZE_OBSERVER].observe(ref);
                }
            }
        }
        disconnectedCallback() {
            super.disconnectedCallback?.();
            this[RESIZE_OBSERVER]?.disconnect();
        }
        // eslint-disable-next-line no-unused-vars
        handleResizeHeight(height) {
            // override as required
            return;
        }
    };
}
