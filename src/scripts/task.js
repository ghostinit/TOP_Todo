export default class Task {
    // Private task fields
    #id;
    #title;
    #complete;
    #description;
    #hasDueDate;
    #dueDate;
    #priority;
    #notes;

    // enum like object with task priorities
    static priorityValues = {
        none: 0,
        low: 1,
        medium: 2,
        high: 3,
        critical: 4,
    }

    // Array containing the priority levels
    static priorityNames = ['None', 'Low', 'Medium', 'High', 'Critical'];

    // The colors of the priorities to display on the UI
    static priorityColors = [
        {
            border: '#dddddd',
            background: '#00000000',
            font: '#dddddd'
        },
        {
            border: '#00dd11',
            background: '#00dd11',
            font: '#2b2b2b'
        },
        {
            border: '#fffd72',
            background: '#fffd72',
            font: '#2b2b2b'
        },
        {
            border: '#ffae00ff',
            background: '#ffae00ff',
            font: '#2b2b2b'
        },
        {
            border: '#FF0000',
            background: '#FF0000',
            font: '#2b2b2b'
        }
    ]

    // The colors of the due dates for the UI
    static dueDateColors = {
        upcoming: {
            background: 'green',
            font: 'black'
        },
        today: {
            background: 'orange',
            font: 'black'
        },
        overdue: {
            background: 'red',
            font: 'black'
        }
    }

    constructor(title, id = null, complete = false, description = "", hasDueDate = false, dueDate = null, priority = Task.priorityValues.none, notes = "") {
        // If no id is passed, create a new one
        if (id === null) {
            this.#id = crypto.randomUUID();
        } else {
            this.#id = id;
        }
        this.#title = title;
        this.#complete = complete;
        this.#description = description;
        this.#hasDueDate = hasDueDate;
        this.#dueDate = dueDate;
        this.#priority = priority;
        this.#notes = notes;
    }

    // =================== STATIC METHODS

    // Returns a task instance from an object literal
    static getTaskFromObject(obj) {
        return new Task(
            obj.title,
            obj.id,
            obj.complete,
            obj.description,
            obj.hasDueDate,
            obj.dueDate,
            obj.priority,
            obj.notes
        )
    }

    // Task object factory containing all fields needed and their defaults
    static getNewTask(title, id = null, complete = false, description = "", hasDueDate = false, dueDate = null, priority = Task.priorityValues.none, notes = "") {
        return new Task(title, id, complete, description, hasDueDate, dueDate, priority, notes);
    }

    // Simplier Task factory
    static getNewVanillaTask(title) {
        return new Task(title);
    }

    // ==================== PUBLIC METHODS

    // Returns the id of the task
    getId() {
        return this.#id;
    }

    // Returns an object literal of the task information
    getTaskInfo() {
        return {
            id: this.#id,
            title: this.#title,
            complete: this.#complete,
            description: this.#description,
            hasDueDate: this.#hasDueDate,
            dueDate: this.#dueDate,
            priority: this.#priority,
            notes: this.#notes
        }
    }

    // Toggles the complete state of the task
    toggleComplete() {
        this.#complete = !this.#complete;
    }
}