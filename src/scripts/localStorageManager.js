// Module for storing and retreiving information locally

// Storage availalbe flag
let storageEnabled = false;

// Checks if storage is available of the specified type
function storageAvailable(type) {
    let storage;
    try {
        storage = window[type];
        const x = "__storage_test__";
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    } catch (e) {
        return (
            e instanceof DOMException &&
            e.name === "QuotaExceededError" &&
            // acknowledge QuotaExceededError only if there's something already stored
            storage &&
            storage.length !== 0
        );
    }
}

// Checks if local storage is available and sets module flag
export function checkStorage() {
    if (storageAvailable("localStorage")) {
        storageEnabled = true;
        return true;
    } else {
        storageEnabled = false;
        return false;
    }
}

// Loads data with the specified storage key
export function loadSavedData(storageKey) {
    if (storageEnabled) {
        const data = localStorage.getItem(storageKey);
        return data
    } else {
        return null
    }
}

// Saves data with the specified storage key
export function saveData(storageKey, data) {
    if (storageEnabled) {
        localStorage.setItem(storageKey, data);
    }
}

// Clears Data with the specified storage key
export function clearData(storageKey) {
    if (storageEnabled) {
        localStorage.removeItem(storageKey);
    }
}
