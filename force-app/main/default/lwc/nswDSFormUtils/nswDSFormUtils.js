// setItems
// --------
// Assumes:
//    @track _items = [];
//    @track _selection = [];

function setItems(that, value, keyPrefix) {
    let items = value ? value.toString().trim() : "";
    let itemsA = [];

    try {
        itemsA = JSON.parse(items);
    } catch(err) {
        itemsA = items == "" ? [] : items.split(";");
    }

    let index = 1;
    let itemMap = new Map(itemsA.map(obj => [ obj instanceof Object ? obj.value : obj, {
        key: keyPrefix + '-' + index++,
        label: (obj instanceof Object ? obj.label : obj),
        value: (obj instanceof Object ? obj.value : obj),
        selected: false
    }])); 

    that._selection.forEach(item => { var obj = itemMap.get(item); if (obj) obj.selected = true; });
    that._items = Array.from(itemMap.values());
}


// setSelection
// --------
// Assumes:
//    @track _items = [];
//    @track _selection = [];

function setSelection(that, value, keyPrefix) {
    let selection = value ? value.toString().split(";") : [];

    let index = 1;
    let itemMap = new Map(that._items.map(obj => [ obj.value, {
        key: keyPrefix + '-' + index++,
        label: (obj instanceof Object ? obj.label : obj),
        value: (obj instanceof Object ? obj.value : obj),
        selected: false
    }])); 

    selection.forEach(item => { var obj = itemMap.get(item); if (obj) obj.selected = true; });
    that._items = Array.from(itemMap.values());
    that._selection = selection;
}


export { setItems, setSelection };