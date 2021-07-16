import { api } from 'lwc';

export const NswDSSlotMixin = (base) =>
class extends base {
    onslotchange(event) {
        let slot = event.target,
            assignedNodes = slot.assignedNodes(),
            elements = [],
            nextElements = assignedNodes;

        do {
            elements = nextElements;
            nextElements = [];

            for (let i = 0; i < elements.length; i++) {
                let element = elements[i];

                let attrs = slot.attributes,
                    length = attrs.length,
                    attr;
    
                for (let i = 0; i < length; i++) {
                    attr = attrs[i];
                    if (attr.name !== 'name') {
                        element.setAttribute(attr.name, attr.value);
                    }
                }

                for (let j = 0; j < element.children.length; j++) {
                    nextElements.push(element.children[j]);
                }
            }
        } while (nextElements.length > 0);
    }
}