import Task from "./task.js";

export default class Project {
    // Private fields
    #id;
    #title;
    #description;
    #tasks;

    constructor(title, description = "", id = null) {
        // If no id was passed in, create one
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

    // Builds a project instance from an object literal
    static getProjectFromObject(obj) {
        let project = new Project(
            obj.title,
            obj.description,
            obj.id
        )

        // Populate the tasks
        for (let task of obj.tasks) {
            const newTask = Task.getTaskFromObject(task);
            project.addTask(newTask);
        }
        return project;
    }

    // Project factory function
    static getNewProject(title, description = "") {
        return new Project(title, description);
    }


    // ================ PUBLIC METHODS

    // Adds a new task to the project
    addTask(task) {
        this.#tasks.push(task);
    }

    // Returns an object literal of task information
    getAllTasks() {
        let tasksArray = [];
        for (const task of this.#tasks) {
            const info = task.getTaskInfo();
            tasksArray.push(info);
        }
        return tasksArray;
    }

    // Returns the id of the project
    getId() {
        return this.#id;
    }

    // Returns an object literal of the project and all its tasks
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

    // Returns the title and id of the project
    getTitleAndId() {
        return {
            title: this.#title,
            id: this.#id
        }
    }

    // Returns title and description of the project
    getTitleAndDesc() {
        return {
            title: this.#title,
            description: this.#description
        }
    }

    // Returns Task object by its index
    getTaskByIndex(index) {
        return this.#tasks[index];
    }

    // Removes a task from the task array
    removeTask(task) {
        const taskId = task.getId();
        const taskIndex = this.#tasks.findIndex((thisTask) => {
            return thisTask.getId() === taskId;
        });
        this.#tasks.splice(taskIndex, 1);
    }

    // Updates title and description
    updateTitleAndDesc(title, description) {
        this.#title = title;
        this.#description = description;
    }
}