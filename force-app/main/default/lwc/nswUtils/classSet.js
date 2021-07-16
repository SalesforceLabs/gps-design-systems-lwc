const classNamesHash = (classes) => {
    return typeof classes === 'string'
        ? classes
              .trim()
              .split(/\s+/)
              .reduce((acc, cn) => ({ ...acc, [cn]: true }), {})
        : classes;
};

const proto = {
    add(className) {
        Object.assign(this, classNamesHash(className));
        return this;
    },
    invert() {
        Object.keys(this).forEach((key) => {
            this[key] = !this[key];
        });
        return this;
    },
    toString() {
        return Object.keys(this)
            .filter((key) => this[key])
            .join(' ');
    },
};

export function classSet(config) {
    return Object.assign(Object.create(proto), classNamesHash(config));
}
