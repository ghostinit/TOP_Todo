import { checkStorage } from "./localStorageManager";
import { loadSavedData } from "./localStorageManager";

import { format, compareAsc } from "date-fns";

import Task from "./task";
import Project from "./project";

const storageKey = "user_data";

const starterProjectInfo = {
    title: "Welcome",
    description: "Complete these tasks to get started!"
}

const starterTasks = [
    {
        title: "Create New Project",
        description: "Start you first Project",
        hasDueDate: true,
        dueDate: format(new Date(), "MM/dd/yyyy"),
        priority: Task.priorityValues.high,
        notes: "Get something done!",
        checklist: []
    },
    {
        title: "Create a Task",
        description: "Create your first task!",
        hasDueDate: true,
        dueDate: format(new Date(), "MM/dd/yyyy"),
        priority: Task.priorityValues.medium,
        notes: "Set your goal",
        checklist: []
    },
    {
        title: "Go for a walk",
        description: "Life is a bear, get some fresh air!",
        hasDueDate: false,
        dueDate: null,
        priority: Task.priorityValues.none,
        notes: "Nature is good for the soul",
        checklist: []
    },
    {
        title: "Buy Yummy Food",
        description: "A simple shopping list",
        hasDueDate: false,
        dueDate: null,
        priority: Task.priorityValues.low,
        notes: "Some yummy food!",
        checklist: [
            {
                item: "Fruits",
                complete: false
            },
            {
                item: "Veggies",
                complete: false
            },
            {
                item: "Ice Cream",
                complete: false
            }
        ]
    }
]

function buildStarterData() {
    const newProject = Project.getNewProject(starterProjectInfo.title, starterProjectInfo.description);
    for (const taskInfo of starterTasks) {
        const newTask = Task.getNewTask(
            taskInfo.title,
            taskInfo.description,
            taskInfo.hasDueDate,
            taskInfo.dueDate,
            taskInfo.priority,
            taskInfo.notes,
            taskInfo.checklist
        );
        newProject.addTask(newTask);
    }
    return newProject;
}

const DataManager = (
    function () {
        const fetchStoredData = () => {
            // Check if local storage is even available
            let data = {};
            const storageEnabled = checkStorage();
            if (storageEnabled) {
                // Check if anything has previous been saved
                data = loadSavedData();
                if (data === null) {
                    console.log("No data found, building starter pack");
                    data = buildStarterData();
                    console.log(data);
                }
            }
            return {}
        }

        return {
            fetchStoredData,

        }
    }
)();

export { DataManager };