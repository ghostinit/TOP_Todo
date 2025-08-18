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

    deleteTaskById(taskId) {
        const taskIndex = this.getTaskIndexById(taskId);
        this.#tasks.splice(taskIndex, 1);
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

    getTaskTitle(taskId) {
        const thisTask = this.getTaskById(taskId).getTaskInfo();
        return thisTask.title;
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

    getTaskIndexById(taskId) {
        return this.#tasks.findIndex((thisTask) => {
            return thisTask.getId() === taskId;
        });
    }

    getTaskById(taskId) {
        const taskIndex = this.getTaskIndexById(taskId);
        return this.#tasks[taskIndex];
    }

    // Removes a task from the task array
    removeTask(task) {
        const taskId = task.getId();
        const taskIndex = this.getTaskIndexById(taskId);
        this.#tasks.splice(taskIndex, 1);
    }

    //Updates a task!
    updateTask(taskId, taskInfo) {
        const task = this.getTaskById(taskId);
        task.updateSelf(taskInfo);
    }

    // Updates title and description
    updateTitleAndDesc(title, description) {
        this.#title = title;
        this.#description = description;
    }

}