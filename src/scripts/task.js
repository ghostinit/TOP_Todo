import { formatDistanceToNow, compareAsc } from "date-fns";

export default class Task {
    #id;
    #title;
    #complete;
    #description;
    #hasDueDate;
    #dueDate;
    #priority;
    #notes;

    static priorityValues = {
        none: 0,
        low: 1,
        medium: 2,
        high: 3,
        critical: 4,
    }

    static priorityNames = ['None', 'Low', 'Medium', 'High', 'Critical'];
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
    static getTaskFromObject(obj) {
        // console.log(obj);
        return new Task(
            obj.title,
            obj.id,
            obj.complete,
            obj.description,
            obj.hasDueDate,
            obj.dueDate,
            obj.priorityValue,
            obj.notes
        )
    }

    static getNewTask(title, id = null, complete = false, description = "", hasDueDate = false, dueDate = null, priority = Task.priorityValues.none, notes = "") {
        return new Task(title, id, complete, description, hasDueDate, dueDate, priority, notes);
    }

    static getNewVanillaTask(title) {
        return new Task(title);
    }

    // ==================== PUBLIC METHODS

    getId() {
        return this.#id;
    }

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

    toggleComplete() {
        this.#complete = !this.#complete;
    }
}