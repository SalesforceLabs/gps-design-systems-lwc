import { runActionOnBufferedTypedCharacters } from 'lightning/utilsPrivate';

function preventDefaultAndStopPropagation(event) {
    event.preventDefault();
    event.stopPropagation();
}

function handleEnterKey({ event, currentIndex, dropdownInterface }) {
    preventDefaultAndStopPropagation(event);
    if (dropdownInterface.isDropdownVisible() && currentIndex >= 0) {
        dropdownInterface.selectByIndex(currentIndex);
    } else {
        dropdownInterface.openDropdownIfNotEmpty();
    }
}

function handlePageUpOrDownKey({ event, currentIndex, dropdownInterface }) {
    preventDefaultAndStopPropagation(event);

    if (!dropdownInterface.isDropdownVisible()) {
        dropdownInterface.openDropdownIfNotEmpty();
    }

    const pageUpDownOptionSkipCount = 10;

    if (dropdownInterface.getTotalOptions() > 0) {
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        requestAnimationFrame(() => {
            let highlightIndex = 0;
            if (event.key === 'PageUp') {
                highlightIndex = Math.max(
                    currentIndex - pageUpDownOptionSkipCount,
                    0
                );
            } else {
                // Jump 10 options down
                highlightIndex = Math.min(
                    currentIndex + pageUpDownOptionSkipCount,
                    dropdownInterface.getTotalOptions() - 1
                );
            }
            dropdownInterface.highlightOptionWithIndex(highlightIndex);
        });
    }
}

function handleHomeOrEndKey({ event, dropdownInterface }) {
    // If not a read-only input we want the default browser behaviour
    if (!dropdownInterface.isInputReadOnly()) {
        return;
    }

    preventDefaultAndStopPropagation(event);

    if (!dropdownInterface.isDropdownVisible()) {
        dropdownInterface.openDropdownIfNotEmpty();
    }
    if (dropdownInterface.getTotalOptions() > 0) {
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        requestAnimationFrame(() => {
            const highlightIndex =
                event.key === 'Home'
                    ? 0
                    : dropdownInterface.getTotalOptions() - 1;
            dropdownInterface.highlightOptionWithIndex(highlightIndex);
        });
    }
}

function handleUpOrDownKey({ event, currentIndex, dropdownInterface }) {
    preventDefaultAndStopPropagation(event);

    if (!dropdownInterface.isDropdownVisible()) {
        dropdownInterface.openDropdownIfNotEmpty();
    }

    const isUpKey = event.key === 'Up' || event.key === 'ArrowUp';
    let nextIndex;
    if (currentIndex >= 0) {
        nextIndex = isUpKey ? currentIndex - 1 : currentIndex + 1;
        if (nextIndex >= dropdownInterface.getTotalOptions()) {
            nextIndex = 0;
        } else if (nextIndex < 0) {
            nextIndex = dropdownInterface.getTotalOptions() - 1;
        }
    } else {
        nextIndex = isUpKey ? dropdownInterface.getTotalOptions() - 1 : 0;
    }

    if (dropdownInterface.getTotalOptions() > 0) {
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        requestAnimationFrame(() => {
            dropdownInterface.highlightOptionWithIndex(nextIndex);
        });
    }
}

function handleEscapeOrTabKey({ event, dropdownInterface }) {
    if (dropdownInterface.isDropdownVisible()) {
        event.stopPropagation();
        dropdownInterface.closeDropdown();
    }
}

function handleTypedCharacters({ event, currentIndex, dropdownInterface }) {
    if (event.key && event.key.length > 1) {
        // not a printable character
        return;
    }
    if (!dropdownInterface.isDropdownVisible()) {
        dropdownInterface.openDropdownIfNotEmpty();
    }
    if (dropdownInterface.isInputReadOnly()) {
        // The element should be read only, it's a work-around for IE11 as it will still make editable an input
        // that has focus and was dynamically changed to be readonly on focus change. Remove once we no longer
        // support IE11
        event.preventDefault();

        // eslint-disable-next-line @lwc/lwc/no-async-operation
        requestAnimationFrame(() =>
            runActionOnBufferedTypedCharacters(
                event,
                dropdownInterface.highlightOptionWithText.bind(
                    this,
                    currentIndex || 0
                )
            )
        );
    }
}

const eventKeyToHandlerMap = {
    Enter: handleEnterKey,

    PageUp: handlePageUpOrDownKey,
    PageDown: handlePageUpOrDownKey,

    Home: handleHomeOrEndKey,
    End: handleHomeOrEndKey,

    Down: handleUpOrDownKey, // IE11/Edge specific
    Up: handleUpOrDownKey, // IE11/Edge specific
    ArrowUp: handleUpOrDownKey,
    ArrowDown: handleUpOrDownKey,

    Esc: handleEscapeOrTabKey, // IE11/Edge specific
    Escape: handleEscapeOrTabKey,
    Tab: handleEscapeOrTabKey,
};

export function handleKeyDownOnInput({
    event,
    currentIndex,
    dropdownInterface,
}) {
    const parameters = { event, currentIndex, dropdownInterface };

    if (eventKeyToHandlerMap[event.key]) {
        eventKeyToHandlerMap[event.key](parameters);
    } else {
        handleTypedCharacters(parameters);
    }
}
