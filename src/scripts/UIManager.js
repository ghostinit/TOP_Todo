import { DataManager } from "./dataManager";

const Manager = (
    function () {
        const init = () => {
            // Fetch stored data or starter data
            const data = DataManager.fetchStoredData();
        }
        return {
            init,
        }
    }
)();

export { Manager }