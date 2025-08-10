import { checkStorage } from "./localStorageManager";
import Task from "./task";
import Project from "./project";

const DataManager = (
    function () {
        const fetchStoredData = () => {
            const storageEnabled = checkStorage();
            console.log(storageEnabled);
            return {}
        }

        return {
            fetchStoredData,

        }
    }
)();

export { DataManager };