"use strict";
class NodeWalker {
    current;
    root;
    entering;
    constructor(root) {
        this.current = root;
        this.root = root;
        this.entering = true;
    }
    next() {
        const cur = this.current;
        let entering = this.entering;
        if (cur == null) {
            return null;
        }
        let container = cur.isContainer;
        if (entering && container) {
            if (cur._firstChild) {
                this.current = cur._firstChild;
                this.entering = true;
            }
            else {
                // stay on node but exit
                this.entering = false;
            }
        }
        else if (cur === this.root) {
            this.current = undefined;
        }
        else if (cur._next == null) {
            this.current = cur._parent;
            this.entering = false;
        }
        else {
            this.current = cur._next;
            this.entering = true;
        }
        return { entering, node: cur };
    }
    resumeAt(node, entering) {
        this.current = node;
        this.entering = entering === true;
    }
}
;
export class Node {
    _type;
    _parent;
    _firstChild;
    _lastChild;
    _prev;
    _next;
    _sourcepos;
    _lastLineBlank;
    _lastLineChecked;
    _open;
    _string_content;
    _literal;
    _listData;
    _info;
    _destination;
    _title;
    _isFenced;
    _fenceChar;
    _fenceLength;
    _fenceOffset;
    _level;
    _onEnter;
    _onExit;
    _htmlBlockType;
    _attrs;
    constructor(nodeType, sourcepos) {
        this._type = nodeType;
        this._parent = undefined;
        this._firstChild = undefined;
        this._lastChild = undefined;
        this._prev = undefined;
        this._next = undefined;
        this._sourcepos = sourcepos;
        this._lastLineBlank = false;
        this._lastLineChecked = false;
        this._open = true;
        this._string_content = undefined;
        this._literal = null;
        this._listData = {};
        this._info = null;
        this._destination = null;
        this._title = undefined;
        this._isFenced = false;
        this._fenceChar = null;
        this._fenceLength = 0;
        this._fenceOffset = undefined;
        this._level = undefined;
        this._onEnter = null;
        this._onExit = null;
        this._attrs = [];
    }
    get isContainer() {
        switch (this._type) {
            case "document":
            case "block_quote":
            case "list":
            case "item":
            case "paragraph":
            case "heading":
            case "emph":
            case "strong":
            case "link":
            case "image":
            case "custom_inline":
            case "custom_block":
                return true;
            default:
                return false;
        }
    }
    get type() {
        return this._type;
    }
    get firstChild() {
        return this._firstChild;
    }
    get lastChild() {
        return this._lastChild;
    }
    get next() {
        return this._next;
    }
    get prev() {
        return this._prev;
    }
    get parent() {
        return this._parent;
    }
    get sourcepos() {
        return this._sourcepos;
    }
    get literal() {
        return this._literal;
    }
    set literal(s) {
        this._literal = s;
    }
    get destination() {
        return this._destination;
    }
    set destination(s) {
        this._destination = s;
    }
    get title() {
        return this._title;
    }
    set title(s) {
        this._title = s;
    }
    get info() {
        return this._info;
    }
    set info(s) {
        this._info = s;
    }
    get level() {
        return this._level;
    }
    set level(s) {
        this._level = s;
    }
    get attrs() {
        return this._attrs;
    }
    set attrs(a) {
        this._attrs = a;
    }
    get listType() {
        return this._listData.type;
    }
    set listType(t) {
        this._listData.type = t;
    }
    get listTight() {
        return this._listData.tight;
    }
    set listTight(t) {
        this._listData.tight = t;
    }
    get listStart() {
        return this._listData.start;
    }
    set listStart(n) {
        this._listData.start = n;
    }
    get listDelimiter() {
        return this._listData.delimiter;
    }
    set listDelimiter(n) {
        this._listData.delimiter = n;
    }
    get onEnter() {
        return this._onEnter;
    }
    set onEnter(s) {
        this._onEnter = s;
    }
    get onExit() {
        return this._onExit;
    }
    set onExit(s) {
        this._onExit = s;
    }
    appendChild(child) {
        child.unlink();
        child._parent = this;
        if (this._lastChild) {
            this._lastChild._next = child;
            child._prev = this._lastChild;
            this._lastChild = child;
        }
        else {
            this._firstChild = child;
            this._lastChild = child;
        }
    }
    ;
    prependChild(child) {
        child.unlink();
        child._parent = this;
        if (this._firstChild) {
            this._firstChild._prev = child;
            child._next = this._firstChild;
            this._firstChild = child;
        }
        else {
            this._firstChild = child;
            this._lastChild = child;
        }
    }
    ;
    unlink() {
        if (this._prev) {
            this._prev._next = this._next;
        }
        else if (this._parent) {
            this._parent._firstChild = this._next;
        }
        if (this._next) {
            this._next._prev = this._prev;
        }
        else if (this._parent) {
            this._parent._lastChild = this._prev;
        }
        this._parent = undefined;
        this._next = undefined;
        this._prev = undefined;
    }
    ;
    insertAfter(sibling) {
        sibling.unlink();
        sibling._next = this._next;
        if (sibling._next) {
            sibling._next._prev = sibling;
        }
        sibling._prev = this;
        this._next = sibling;
        sibling._parent = this._parent;
        if (!sibling._next && sibling._parent) {
            sibling._parent._lastChild = sibling;
        }
    }
    insertBefore(sibling) {
        sibling.unlink();
        sibling._prev = this._prev;
        if (sibling._prev) {
            sibling._prev._next = sibling;
        }
        sibling._next = this;
        this._prev = sibling;
        sibling._parent = this._parent;
        if (!sibling._prev && sibling._parent) {
            sibling._parent._firstChild = sibling;
        }
    }
    walker() {
        return new NodeWalker(this);
    }
    ;
}
