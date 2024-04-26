export default class {
  _sfGpsDsOnWindowResize;

  /* bind must be called in the connectedCallback method */
  bind(handler) {
    this._sfGpsDsOnWindowResize = {
      handler: (e) => {
        handler(e);
      }
    }

    window.addEventListener("resize", this._sfGpsDsOnWindowResize.handler, false);
  }

  /* unbind must be called in the disconnectedCallback method */
  unbind() {
    if (this._sfGpsDsOnWindowResize) {
      window.removeEventListener("resize", this._sfGpsDsOnWindowResizehandler.handler, false);
      delete this._sfGpsDsOnWindowResize;
    }
    
    if (super.disconnectedCallback) {
      super.connectedCallback();
    }
  }
}
