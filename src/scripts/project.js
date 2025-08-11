import Task from "./task.js";

export default class Project {
    #id;
    #title;
    #description;
    #tasks;

    constructor(title, description = "", id = null) {
        if (id === null) {
            this.#id = crypto.randomUUID();
        } else {
            this.#id = id;
        }

        this.#title = title;
        this.#description = description;
        this.#tasks = [];
    }

    // ================ STATIC METHODS
    static getProjectFromObject(obj) {
        let project = new Project(
            obj.title,
            obj.description,
            obj.id
        )

        for (let task of obj.tasks) {
            const newTask = Task.getTaskFromObject(task);
            project.addTask(newTask);
        }
        return project;
    }

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

    getTitleAndId() {
        return {
            title: this.#title,
            id: this.#id
        }
    }

    getTitleAndDesc() {
        return {
            title: this.#title,
            description: this.#description
        }
    }

    getTaskByIndex(index) {
        return this.#tasks[index];
    }

    removeTask(task) {
        const taskId = task.getId();
        const taskIndex = this.#tasks.findIndex((thisTask) => {
            return thisTask.getId() === taskId;
        });
        this.#tasks.splice(taskIndex, 1);
    }
}