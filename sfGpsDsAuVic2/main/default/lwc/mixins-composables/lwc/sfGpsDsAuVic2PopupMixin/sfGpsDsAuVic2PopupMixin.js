export default function PopupMixin(base, popupSize = {
    width: 626,
    height: 436
}) {
    // @ts-ignore
    return class PopupMixin extends base {
        popupWindow = null;
        popupInterval;
        popup = popupSize;
        openPopup(content, key) {
            const $window = window;
            const { popupTop, popupLeft } = this.resizePopup($window);
            // If popup exists, close it
            if (this.popupWindow && this.popupInterval) {
                clearInterval(this.popupInterval);
                this.popupWindow.close();
            }
            this.popupWindow = $window.open(content, `pop-${key}`, `height=${this.popup.height},width=${this.popup.width},left=${popupLeft},top=${popupTop},screenX=${popupLeft},screenY=${popupTop}`);
            if (!this.popupWindow)
                return;
            this.popupWindow.focus();
            // Detect if popup closes
            // eslint-disable-next-line @lwc/lwc/no-async-operation
            this.popupInterval = setInterval(() => {
                if (!this.popupWindow || this.popupWindow.closed) {
                    clearInterval(this.popupInterval);
                    this.popupWindow = null;
                }
            }, 500);
        }
        resizePopup($window) {
            const width = $window.innerWidth ||
                document.documentElement.clientWidth ||
                $window.screenX;
            const height = $window.innerHeight ||
                document.documentElement.clientHeight ||
                $window.screenY;
            const systemZoom = width / $window.screen.availWidth;
            const popupLeft = (width - this.popup.width) / 2 / systemZoom +
                ($window.screenLeft !== undefined
                    ? $window.screenLeft
                    : $window.screenX);
            const popupTop = (height - this.popup.height) / 2 / systemZoom +
                ($window.screenTop !== undefined ? $window.screenTop : $window.screenY);
            return {
                popupTop,
                popupLeft
            };
        }
    };
}
