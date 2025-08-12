import { checkStorage } from "./localStorageManager";
import { loadSavedData } from "./localStorageManager";
import { saveData } from "./localStorageManager";

import { format, compareAsc } from "date-fns";

import Task from "./task";
import Project from "./project";



const DataManager = (
    function () {
        let user_data = [];

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

        // =================== METHODS ======================

        const buildStarterData = () => {
            const newProject = Project.getNewProject(starterProjectInfo.title, starterProjectInfo.description);
            for (const taskInfo of starterTasks) {
                const newTask = Task.getNewTask(
                    taskInfo.title,
                    taskInfo.description,
                    taskInfo.hasDueDate,
                    taskInfo.dueDate,
                    taskInfo.priorityValue,
                    taskInfo.notes,
                    taskInfo.checklist
                );
                newProject.addTask(newTask);
            }
            user_data.push(newProject);
        }

        const fetchStoredData = () => {
            // Check if local storage is even available
            let data = {};
            const storageEnabled = checkStorage();
            if (storageEnabled) {
                // console.log('Storage Enabled');
                // Check if anything has previous been saved
                data = loadSavedData(storageKey);
                if (data === null) {
                    // console.log("No data found, building starter pack");
                    buildStarterData();
                    saveUserData();
                } else {
                    console.log("Stored Data Found");
                    //load the data
                    // data should contain the user_data is JSON form
                    const userObj = JSON.parse(data);
                    for (let obj of userObj) {
                        // console.log(`Building project from: `, obj);
                        const project = Project.getProjectFromObject(obj);
                        user_data.push(project);
                    }
                }
            } else {
                // Unable to save locally, return starter project anyway
                buildStarterData();
            }
            // console.log(`Post build data: `, user_data)
            // return user_data;
        }

        const getProjectTasks = (index) => {
            const tasks = user_data[index].getAllTasks();
            return tasks;
        }

        const getProjectIdxById = (projectId) => {
            const idx = user_data.findIndex((project) => {
                return project.getId() === projectId;
            });
            return idx;
        }

        const getProjectIdByIdx = (projectIdx) => {
            return user_data[projectIdx].getId();
        }

        const getProjectTitlesAndIds = () => {
            let projectsInfo = [];
            // console.log(`User data: `, user_data);
            for (let project of user_data) {
                projectsInfo.push(project.getTitleAndId());
            }
            return projectsInfo;
        }

        const getProjectTitleAndDescByIdx = (idx) => {
            return user_data[idx].getTitleAndDesc();
        }

        const getTaskPriorityColors = () => {
            return Task.priorityColors;
        }

        const getTaskPriorityNames = () => {
            return Task.priorityNames;
        }

        const saveUserData = () => {
            // Don't save if nothing in user_data
            if (!(user_data.length === 0)) {
                console.log('Saving User Data');
                let allUserInfo = [];
                for (const thisProject of user_data) {
                    // console.log(thisProject)
                    const projectInfo = thisProject.getProjectInfo();
                    allUserInfo.push(projectInfo);
                }
                const JSONstring = JSON.stringify(allUserInfo);
                saveData(storageKey, JSONstring);
            }
        }





        return {
            buildStarterData,
            fetchStoredData,
            getProjectIdByIdx,
            getProjectIdxById,
            getProjectTasks,
            getProjectTitleAndDescByIdx,
            getProjectTitlesAndIds,
            getTaskPriorityColors,
            getTaskPriorityNames
        }
    }
)();

export { DataManager };

// const storageKey = "user_data";

// const starterProjectInfo = {
//     title: "Welcome",
//     description: "Complete these tasks to get started!"
// }

// const starterTasks = [
//     {
//         title: "Create New Project",
//         description: "Start you first Project",
//         hasDueDate: true,
//         dueDate: format(new Date(), "MM/dd/yyyy"),
//         priority: Task.priorityValues.high,
//         notes: "Get something done!",
//         checklist: []
//     },
//     {
//         title: "Create a Task",
//         description: "Create your first task!",
//         hasDueDate: true,
//         dueDate: format(new Date(), "MM/dd/yyyy"),
//         priority: Task.priorityValues.medium,
//         notes: "Set your goal",
//         checklist: []
//     },
//     {
//         title: "Go for a walk",
//         description: "Life is a bear, get some fresh air!",
//         hasDueDate: false,
//         dueDate: null,
//         priority: Task.priorityValues.none,
//         notes: "Nature is good for the soul",
//         checklist: []
//     },
//     {
//         title: "Buy Yummy Food",
//         description: "A simple shopping list",
//         hasDueDate: false,
//         dueDate: null,
//         priority: Task.priorityValues.low,
//         notes: "Some yummy food!",
//         checklist: [
//             {
//                 item: "Fruits",
//                 complete: false
//             },
//             {
//                 item: "Veggies",
//                 complete: false
//             },
//             {
//                 item: "Ice Cream",
//                 complete: false
//             }
//         ]
//     }
// ]

// function buildStarterData() {
//     const newProject = Project.getNewProject(starterProjectInfo.title, starterProjectInfo.description);
//     for (const taskInfo of starterTasks) {
//         const newTask = Task.getNewTask(
//             taskInfo.title,
//             taskInfo.description,
//             taskInfo.hasDueDate,
//             taskInfo.dueDate,
//             taskInfo.priority,
//             taskInfo.notes,
//             taskInfo.checklist
//         );
//         newProject.addTask(newTask);
//     }
//     return newProject;
// }