// Module for managing user data
import { checkStorage, loadSavedData, saveData, clearData } from "./localStorageManager";

import { format, compareAsc } from "date-fns";

import Task from "./task";
import Project from "./project";



const DataManager = (
    function () {
        // Array that holds projects and tasks
        let user_data = [];

        // Storage key passed to 'localStorageManager'
        const storageKey = "user_data";

        // Information for the UI fetched from Task class
        const priorityNames = Task.priorityNames;
        const priorityColors = Task.priorityColors;
        const dueDateColors = Task.dueDateColors;

        // Object literal for starter project
        const starterProjectInfo = {
            title: "Welcome",
            description: "Complete these tasks to get started!"
        }

        // Object literal for starter tasks
        const starterTasks = [
            {
                title: "Create New Project",
                description: "Start you first Project",
                hasDueDate: true,
                dueDate: format(new Date(), "MM/dd/yyyy"),
                priority: Task.priorityValues.high,
                notes: "Get something done!"
            },
            {
                title: "Create a Task",
                description: "Create your first task!",
                hasDueDate: true,
                dueDate: format(new Date(), "MM/dd/yyyy"),
                priority: Task.priorityValues.medium,
                notes: "Set your goal"
            },
            {
                title: "Go for a walk",
                description: "Life is a bear, get some fresh air!",
                hasDueDate: false,
                dueDate: null,
                priority: Task.priorityValues.none,
                notes: "Nature is good for the soul"
            }
        ]

        // =================== METHODS ======================

        // Takes object literals and creates instances of classes
        // Populates user_data with project
        const buildStarterData = () => {
            const newProject = Project.getNewProject(starterProjectInfo.title, starterProjectInfo.description);
            for (const taskInfo of starterTasks) {
                const newTask = Task.getNewTask(
                    taskInfo.title,
                    null, // Id
                    false, // complete
                    taskInfo.description,
                    taskInfo.hasDueDate,
                    taskInfo.dueDate,
                    taskInfo.priority,
                    taskInfo.notes
                );
                console.log(newTask);
                newProject.addTask(newTask);
            }
            user_data.push(newProject);
        }

        const clearAllData = () => {
            clearData(storageKey);
        }

        const fetchStoredData = () => {
            // Check if local storage is even available
            let data = {};
            const storageEnabled = checkStorage();

            // TODO REMOVE ME
            // clearData(storageKey)
            if (storageEnabled) {
                data = loadSavedData(storageKey);
                if (data === null) {
                    // No data found, create starter project then save
                    buildStarterData();
                    saveUserData();
                } else {
                    // Parse the loaded data
                    const userObj = JSON.parse(data);
                    for (let obj of userObj) {
                        const project = Project.getProjectFromObject(obj);
                        user_data.push(project);
                    }
                }
            } else {
                // Unable to save locally, return starter project anyway
                buildStarterData();
            }
        }

        // Fetches an array containing object literals of all tasks
        const getProjectTasks = (index) => {
            const tasks = user_data[index].getAllTasks();
            return tasks;
        }

        // Fetches the index in user_data of a project by its id
        const getProjectIdxById = (projectId) => {
            const idx = user_data.findIndex((project) => {
                return project.getId() === projectId;
            });
            return idx;
        }

        // Fetches the id of a project by its position in user_data array
        const getProjectIdByIdx = (projectIdx) => {
            return user_data[projectIdx].getId();
        }

        // Fetches the title and ids of all projects in user_data
        const getProjectTitlesAndIds = () => {
            let projectsInfo = [];
            for (let project of user_data) {
                projectsInfo.push(project.getTitleAndId());
            }
            return projectsInfo;
        }

        // Fetches a projects title and description by its position in user_data
        const getProjectTitleAndDescByIdx = (idx) => {
            return user_data[idx].getTitleAndDesc();
        }

        // const getTaskPriorityColors = () => {
        //     return Task.priorityColors;
        // }

        // const getTaskPriorityNames = () => {
        //     return Task.priorityNames;
        // }

        // const getDueDateColors = () => {
        //     return Task.dueDateColors;
        // }

        // Saves user data
        // Fetches object literals for all projects and their tasks
        // then stringifies them
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

        // Toggles complete state of a task
        // selectedIndex = current project active in UI
        const toggleTaskComplete = (selectedIndex, taskId) => {
            // get the index of the task by id
            // needs to be done this way because the
            // order of the sorted tasks
            // will put them in different positions
            // and is therefore unreliable
            const taskIdx = getTaskIdxById(selectedIndex, taskId);
            // fetch the active project
            const project = user_data[selectedIndex];
            // fetch the tasks
            const task = project.getTaskByIndex(taskIdx);
            task.toggleComplete();
        }

        // Fetches the index of the task by its id
        const getTaskIdxById = (selectedIndex, taskId) => {
            const taskIdx = user_data[selectedIndex].getAllTasks().findIndex((task) => {
                return task.id === taskId;
            });
            return taskIdx;
        }

        return {
            priorityNames,
            priorityColors,
            dueDateColors,
            buildStarterData,
            clearAllData,
            fetchStoredData,
            // getDueDateColors,
            getProjectIdByIdx,
            getProjectIdxById,
            getProjectTasks,
            getProjectTitleAndDescByIdx,
            getProjectTitlesAndIds,
            // getTaskPriorityColors,
            // getTaskPriorityNames,
            saveUserData,
            toggleTaskComplete
        }
    }
)();

export { DataManager };
