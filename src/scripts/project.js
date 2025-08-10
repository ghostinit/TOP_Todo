import Task from "./task.js";

export default class Project {
    #id;
    #title;
    #description;
    #tasks;

    constructor(title, description = "") {
        this.#id = crypto.randomUUID();
        this.#title = title;
        this.#description = description;
        this.#tasks = [];
    }

    // ================ STATIC METHODS
    static getNewProject(title, description = "") {
        return new Project(title, description);
    }


    // ================ PUBLIC METHODS
    addTask(task) {
        this.#tasks.push(task);
    }

    getId() {
        return this.#id;
    }

    getTaskByIndex(index) {
        return this.#tasks[index];
    }

    getProjectInfo() {
        let taskInfo = []
        for (let task of this.#tasks) {
            taskInfo.push(task.getTaskInfo());
        }

        return {
            id: this.#id,
            title: this.#title,
            description: this.#description,
            tasks: taskInfo,
        }
    }

    removeTask(task) {
        const taskId = task.getId();
        const taskIndex = this.#tasks.findIndex((thisTask) => {
            return thisTask.getId() === taskId;
        });
        this.#tasks.splice(taskIndex, 1);
    }
}