let storageEnabled = false;

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

export function checkStorage() {
    if (storageAvailable("localStorage")) {
        storageEnabled = true;
        return true;
    } else {
        storageEnabled = false;
        return false;
    }
}

export function loadSavedData(storageKey) {
    console.log(`Storage length: ${localStorage.length}`)
    console.log(`Fetching data with key: ${storageKey}`);
    const data = localStorage.getItem(storageKey);
    console.log(`Saved data: ${data}`);
    return data
}

export function saveData(storageKey, data) {
    console.log(`Saving: ${storageKey} with data: ${data}`);
    localStorage.setItem(storageKey, data);
    console.log(`Storage length: ${localStorage.length}`);
}

// export function load() {
//     if (storageAvailable("localStorage")) {
//         console.log("Storage is available");
//         storageEnabled = true;
//         if (!localStorage.getItem(storageKey)) {
//             // Nothing stored yet, create default project and tasks
//             console.log("Nothing stored yet");
//             const baseProject = Project.getNewProject("Welcome", "A list of tasks to get started");
//         } else {
//             console.log("User storage found");
//             //We've saved before, load it up
//         }
//     } else {
//         console.log("Storage NOT available");
//         storageEnabled = false;
//         return { available: false }
//     }
// }

