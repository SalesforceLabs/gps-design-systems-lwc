function processArguments(value) {
  const isFn = typeof value === "function";

  if (!isFn && typeof value !== "object") {
    throw new Error(
      "sfGpsDsOnClickOutside: args must be a function or an object"
    );
  }

  return {
    handler: isFn ? value : value.handler,
    middleware: value.middleware || ((item) => item),
    events: value.events || [ "touchstart", "click" ],
    active: !(value.active === false)
  };
}

/**
 * The general principle is that we circumvent event rewriting when an event reaches the
 * shadow DOM boundary. This is when the target is obfuscated to the outside observer by Locker
 * or LWS. It assigns the LWC host as a target and we thus loose track of where the
 * event actually originated -- very much by design. 
 * 
 * While there is no way for the LWC or internal element to know they are contained by the
 * host, the retargeting process does not alter the original event much...
 * 
 * By adding a custom attribute to the event in a listener (the tagger) attached directly on the
 * element we want to monitor (and hence within the LWC scope), we then check whether the event
 * received on a second listener attached on the document (outside the LWC scope) has that
 * attribute or not.
 * 
 * If it does, the event happened inside, otherwise it happened outside!
 * We use uuids and a set to make sure we can combine over multiple composed LWCs.
 */

export default class {
  _sfGpsDsOnClickOutside = {};

  /* bind must be called only once in the renderedCallback method */
  bind(pel, ref, value) {
    const uuid = crypto.randomUUID();
    const el = pel.refs[ref];
    const { events, handler, middleware, active } = processArguments(value);
  
    if (active) {
      this._sfGpsDsOnClickOutside[ref] = events.map((event) => {
        const rv = {
          event,
          tagger: (e) => {
            const isClickOutside = e.target !== el && !el.contains(e.target);

            if (!isClickOutside) {
              /* Create a set only if it isn't there yet */
              if (!e._sfGpsDsOnClickOutside) e._sfGpsDsOnClickOutside = new Set();
              e._sfGpsDsOnClickOutside.add(uuid);
            }
          },
          handler: (e) => {
            /* it is outside if the property does not exist or the uuid is not there */
            const isClickOutside = !(e._sfGpsDsOnClickOutside && e._sfGpsDsOnClickOutside.has(uuid))

            if (isClickOutside && middleware(e)) {
              handler(e);
            }
          },
        };

        el.addEventListener(event, rv.tagger, false);
        document.addEventListener(event, rv.handler, false);

        return rv;
      });
    }
  }

  /* unbind must be call only once in the disconnectedCallback method */
  unbind(pel, ref) {
    const el = pel.refs[ref];

    if (this._sfGpsDsOnClickOutside[ref]) {
      this._sfGpsDsOnClickOutside[ref].forEach(({ event, tagger, handler }) => {
        document.removeEventListener(event, handler, false);
        el.removeEventListener(event, tagger, false);
      });

      delete this._sfGpsDsOnClickOutside[ref];
    }
    
    if (super.disconnectedCallback) {
      super.connectedCallback();
    }
  }
}
