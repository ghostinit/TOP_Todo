export default class Task {
    #id;
    #title;
    #complete;
    #description;
    #hasDueDate;
    #dueDate;
    #priority;
    #notes;
    #checklist;

    static priorityValues = {
        none: 0,
        low: 1,
        medium: 2,
        high: 3,
        critical: 4,
    }

    static priorityNames = ['None', 'Low', 'Medium', 'High', 'Critical'];

    constructor(title, description = "", hasDueDate = false, dueDate = null, priority = Task.priorityValues.none, notes = "", checklist = [], id = null) {
        if (id === null) {
            this.#id = crypto.randomUUID();
        } else {
            this.#id = id;
        }
        this.#title = title;
        this.#complete = false;
        this.#description = description;
        this.#hasDueDate = hasDueDate;
        this.#dueDate = dueDate;
        this.#priority = priority;
        this.#notes = notes;
        this.#checklist = checklist;
    }

    // =================== STATIC METHODS
    static getTaskFromObject(obj) {
        return new Task(
            obj.title,
            obj.description,
            obj.hasDueDate,
            obj.dueDate,
            obj.priority,
            obj.notes,
            obj.checklist,
            obj.id
        )
    }

    static getNewTask(title, description = "", hasDueDate = false, dueDate = null, priority = Task.priorityValues.none, notes = "", checklist = []) {
        return new Task(title, description, hasDueDate, dueDate, priority, notes, checklist);
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
            priorityValue: this.#priority,
            priorityName: Task.priorityNames[this.#priority],
            notes: this.#notes,
            checklist: this.#checklist
        }
    }



    markComplete() {
        this.#complete = true;
    }

    markIncomplete() {
        this.#complete = false;
    }

    updateTaskInfo(title, description, hasDueDate, dueDate, priority, notes, checklist) {
        this.#title = title;
        this.#description = description;
        this.#hasDueDate = hasDueDate;
        this.#dueDate = dueDate;
        this.#priority = priority;
        this.#notes = notes;
        this.#checklist = checklist;
    }


}