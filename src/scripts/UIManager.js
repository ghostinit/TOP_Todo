import { DataManager } from "./dataManager";

const Manager = (
    function () {
        const init = () => {
            const data = DataManager.fetchStoredData();
        }
        return {
            init,
        }
    }
)();

export { Manager }