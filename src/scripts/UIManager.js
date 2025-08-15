// Module for controling app UI

import { DataManager } from "./dataManager";
import taskTemplate from "../task-template.html";
import { formatDistanceToNow, compareAsc, format } from "date-fns";


import imgChecked from "../assets/icons/checkbox-marked-outline.svg";
import imgUnChecked from "../assets/icons/checkbox-blank-outline.svg";

const Manager = (
    function () {
        // The index of the active project in user_data in DataManager
        let selectedIndex = 0;

        // How to sort the tasks
        let taskSort = 'btn-task-sort-none';

        // Ref to the projectList container in HTML
        const projectListContainer = document.querySelector('#project-list-container');

        // Ref to the taskList container in HTML
        const taskList = document.querySelector('#task-list');

        // Ref to the buttons used for sorting tasks
        const sortButtons = document.querySelectorAll('.btn-task-sort');

        // Confirm Modal objects
        const actionDeleteProject = "delete-project";
        const actionDeleteTask = "delete-task";
        const actionInvalidAction = "invalid-action";
        const confirmModal = document.querySelector('#confirm-modal');
        const btnConfirmModalClose = document.querySelector('#close-confirm-modal');
        const btnSubmitConfirmModal = document.querySelector('#submit-confirm-button');


        // Project modal objects
        const projectModalModeEdit = "edit";
        const projectModalModeAdd = "add";
        const btnAddProject = document.querySelector('#btn-add-project');
        const projectModal = document.querySelector('#project-modal');
        const btnCloseProjectModal = document.querySelector('#close-project-modal');
        const btnSubmitProject = document.querySelector('#submit-project-button');
        const projectForm = document.querySelector('#project-form');
        const btnEditProject = document.querySelector('#btn-project-edit');
        const btnDeleteProject = document.querySelector('#btn-project-delete');

        // Task modal object
        const taskModalModeEdit = "edit";
        const taskModalModeAdd = "add";
        const btnAddTask = document.querySelector('#btn-add-task');
        const taskModal = document.querySelector('#task-modal');
        const btnCloseTaskModal = document.querySelector('#close-task-modal');
        const btnSubmitTask = document.querySelector('#submit-task-button');
        const taskForm = document.querySelector('#task-form');
        const chkTaskHasDueDate = document.querySelector('#input-task-has-duedate');
        const imgTaskHasDueDate = document.querySelector('.img-custom-checkbox');
        const datePickerTaskDueDate = document.querySelector('#task-duedate-picker');
        const containerDatePicker = document.querySelector('#task-duedate-input-div');
        const priorityRadioGroup = document.querySelector('#priority-radio-group');
        // const btnEditTask = document.querySelector('.btn-task-edit');
        // const btnDeleteTask = document.querySelector('.btn-task-delete');

        // Initialize the UI
        // Includes setting event listeners
        const init = () => {
            // Fetch stored data or starter data
            DataManager.fetchStoredData();

            // REMOVE ME!
            // DataManager.buildStarterData();

            // Set colors of the radio buttons on Task modal
            for (let i = 0; i < DataManager.priorityColors.length; i++) {
                const thisLabel = document.querySelector(`#label-priority${i}`)
                thisLabel.style.border = `1px solid ${DataManager.priorityColors[i].border}`;
                thisLabel.style.backgroundColor = DataManager.priorityColors[i].background;
                thisLabel.style.color = DataManager.priorityColors[i].font;
            }

            // Set event listeners on the sort buttons
            for (let button of sortButtons) {
                button.addEventListener('click', (event) => {
                    // Get the id of the button clicked
                    taskSort = event.target.id;
                    // Remove 'task-sort-active' class from all buttons
                    for (let btn of sortButtons) {
                        btn.classList.remove('task-sort-active');
                    }
                    // Add it back to the clicked button
                    event.target.classList.add('task-sort-active');
                    // Repopulated taskList container
                    populateTasks();
                })
            }

            // Event listener for projectList container
            projectListContainer.addEventListener('click', (event) => {
                if (event.target.classList.contains('project-list-item')) {
                    const id = event.target.id;
                    updateSelectedProject(id);
                }
            })

            // Event listener on taskList container
            taskList.addEventListener('click', (event) => {
                if (event.target.classList.contains('task-item-checkbox')) {
                    // Checkbox was clicked, toggle its complete state
                    // Then repopulate taskList
                    const taskDiv = event.target.closest('.task-item');
                    if (taskDiv) {
                        DataManager.toggleTaskComplete(selectedIndex, taskDiv.id);
                        DataManager.saveUserData();
                        populateTasks();
                    }
                } else if (event.target.classList.contains('btn-task-edit')) {
                    const taskDiv = event.target.closest('.task-item');
                    if (taskDiv) {
                        const id = taskDiv.id;
                        console.log(`Edit button clicked for task: ${id}`);
                    }
                } else if (event.target.classList.contains('btn-task-delete')) {
                    const taskDiv = event.target.closest('.task-item');
                    if (taskDiv) {
                        const id = taskDiv.id;
                        console.log(`Delete button clicked for task: ${id}`);
                    }
                }
            });

            // ========================= CONFIRM MODAL STUFF ======================
            btnConfirmModalClose.addEventListener('click', () => {
                confirmModal.classList.remove('show');
            })

            // Close cofirm modal when click outside
            confirmModal.addEventListener('click', (event) => {
                if (event.target === confirmModal) {
                    confirmModal.classList.remove('show');
                }
            });

            // Modal action confirmed
            btnSubmitConfirmModal.addEventListener('click', (event) => {
                event.preventDefault();
                confirmModal.classList.remove('show');
                const confirmAction = confirmModal.dataset.confirmAction;
                const objectId = confirmModal.dataset.objectId;

                if (confirmAction === actionDeleteProject) {
                    DataManager.deleteProject(objectId);
                    console.log(`Selected Idx: ${selectedIndex}`);
                    const projectCount = DataManager.getProjectCount();
                    console.log(`Project count: ${projectCount}`);
                    if (selectedIndex === DataManager.getProjectCount()) {
                        selectedIndex = DataManager.getProjectCount() - 1;
                    }
                    console.log(`New selected index: ${selectedIndex}`);
                    populateProjects();
                    updateSelectedProject();
                }
            })
            // ========================= PROJECT SPECIFIC STUFF ===================


            // Add project button event listener
            btnAddProject.addEventListener('click', () => {
                projectModal.querySelector('#project-modal-title').innerText = 'Add Project';
                btnSubmitProject.innerText = 'Add';

                projectModal.querySelector('#project-title-input').value = '';
                projectModal.querySelector('#project-desc-input').value = '';


                projectModal.dataset.modalMode = projectModalModeAdd;
                projectModal.classList.add('show');
                projectModal.querySelector('#project-title-input').focus()
            });

            // Close the project modal
            btnCloseProjectModal.addEventListener('click', () => {
                projectModal.classList.remove('show');
            });

            // Close project modal when click outside
            projectModal.addEventListener('click', (event) => {
                if (event.target === projectModal) {
                    projectModal.classList.remove('show');
                }
            });

            // Submit project button
            btnSubmitProject.addEventListener('click', (event) => {
                event.preventDefault();
                const isValid = projectForm.reportValidity();
                if (isValid) {
                    projectModal.classList.remove('show');
                    const mode = projectModal.dataset.modalMode;

                    const titleInput = projectModal.querySelector('#project-title-input');
                    const title = titleInput.value;

                    const descInput = projectModal.querySelector('#project-desc-input');
                    const desc = descInput.value;

                    if (mode === projectModalModeAdd) {
                        DataManager.addNewProject(title, desc);
                    } else if (mode === projectModalModeEdit) {
                        const id = projectModal.dataset.projectId;
                        DataManager.updateProject(id, title, desc);
                    }
                    populateProjects();
                    updateSelectedProject();
                }
            });

            btnEditProject.addEventListener('click', () => {
                const title = projectModal.querySelector('#project-modal-title');
                title.innerText = 'Edit Project';
                btnSubmitProject.innerText = 'Save';
                projectModal.dataset.modalMode = projectModalModeEdit;
                projectModal.dataset.projectId = DataManager.getProjectIdByIdx(selectedIndex);

                const projectInfo = DataManager.getProjectTitleAndDescByIdx(selectedIndex);

                const titleInput = projectModal.querySelector('#project-title-input');
                titleInput.value = projectInfo.title;

                const descInput = projectModal.querySelector('#project-desc-input');
                descInput.value = projectInfo.description;

                projectModal.classList.add('show');
                titleInput.focus();
            })

            btnDeleteProject.addEventListener('click', () => {
                if (DataManager.getProjectCount() === 1) {
                    confirmModal.confirmAction = actionInvalidAction;
                    document.querySelector('#close-modal-title').innerText = "Uh Oh!";
                    document.querySelector('#close-modal-message').innerText = "There MUST be at least 1 project!";
                    confirmModal.classList.add('show');
                } else {
                    confirmModal.dataset.confirmAction = actionDeleteProject;
                    confirmModal.dataset.objectId = DataManager.getProjectIdByIdx(selectedIndex);
                    const projectTitle = DataManager.getProjectTitleAndDescByIdx(selectedIndex)['title'];
                    document.querySelector('#close-modal-title').innerText = "Delete Project";
                    document.querySelector('#close-modal-message').innerText = `Really Delete Project "${projectTitle}"?`;
                    confirmModal.classList.add('show');
                }
            })

            // ========================== TASK MODAL STUFF ===========================

            // Add task event listener
            btnAddTask.addEventListener('click', () => {
                taskModal.querySelector('#task-modal-title').innerText = "Add New Task";
                btnSubmitTask.innerText = "Add";

                // Set defaults
                taskModal.querySelector('#task-title-input').innerText = "";
                taskModal.querySelector('#task-desc-input').innerText = "";
                imgTaskHasDueDate.src = imgUnChecked;
                chkTaskHasDueDate.checked = false;
                containerDatePicker.classList.add('hide');

                datePickerTaskDueDate.valueAsDate = new Date();

                updateSelectedTaskModalRadio(0);

                taskModal.dataset.modalMode = taskModalModeAdd;
                taskModal.classList.add('show');
                taskModal.querySelector('#task-title-input').focus();
            });

            // Close task modal
            btnCloseTaskModal.addEventListener('click', () => {
                taskModal.classList.remove('show');
            });

            // Close task modal on outside click
            taskModal.addEventListener('click', (event) => {
                if (event.target === taskModal) {
                    taskModal.classList.remove('show');
                }
            });

            // Submit task button
            btnSubmitTask.addEventListener('click', (event) => {
                event.preventDefault();
                const isValid = taskForm.reportValidity();
                if (isValid) {
                    taskModal.classList.remove('show');
                    const taskTitle = document.querySelector('#task-title-input').value
                    const taskDesc = document.querySelector('#task-desc-input').value
                    const taskHasDueDate = chkTaskHasDueDate.checked;
                    let taskDueDate = null
                    if (taskHasDueDate) {
                        taskDueDate = format(datePickerTaskDueDate.valueAsDate, "MM/dd/yyyy");
                    }
                    const priority = parseInt(document.querySelector('input[name="priority"]:checked')?.value)
                    const notes = document.querySelector('#task-notes-input').value;
                    console.log({
                        title: taskTitle,
                        desc: taskDesc,
                        hasDueDate: taskHasDueDate,
                        taskDueDate: taskDueDate,
                        priority: priority,
                        notes: notes
                    })
                    DataManager.addTaskToActiveProject(
                        selectedIndex,
                        taskTitle,
                        taskDesc,
                        taskHasDueDate,
                        taskDueDate,
                        priority,
                        notes
                    )
                    populateTasks();
                }
            });

            chkTaskHasDueDate.addEventListener('click', (event) => {
                if (event.target.checked) {
                    imgTaskHasDueDate.src = imgChecked;
                    datePickerTaskDueDate.required = true;
                    containerDatePicker.classList.remove('hide');
                } else {
                    imgTaskHasDueDate.src = imgUnChecked;
                    datePickerTaskDueDate.required = false;
                    containerDatePicker.classList.add('hide');
                }
            });

            document.querySelectorAll('input[name="priority"]').forEach(radio => {
                radio.addEventListener('change', () => {
                    const newValue = document.querySelector('input[name="priority"]:checked')?.value
                    updateSelectedTaskModalRadio(newValue);
                });
            });


            // Populate UI with user data
            populateProjects();
            populateTasks();
        }

        const updateSelectedTaskModalRadio = (newIdx) => {
            for (let i = 0; i < DataManager.priorityColors.length; i++) {
                document.querySelector(`#label-priority${i}`).classList.remove('selected-priority');
            }
            document.querySelector(`#label-priority${newIdx}`).classList.add('selected-priority');
        }

        // Populate project side bar
        const populateProjects = () => {
            if (DataManager.getProjectCount() > 0) {
                const projectsInfos = DataManager.getProjectTitlesAndIds();

                projectListContainer.innerHTML = "";
                for (let idx = 0; idx < projectsInfos.length; idx++) {

                    const projectTitle = projectsInfos[idx].title;
                    const projectId = projectsInfos[idx].id;

                    const listItem = document.createElement('div');
                    listItem.classList.add('project-list-item');
                    listItem.id = projectId;
                    listItem.innerText = projectTitle;

                    if (selectedIndex === idx) {
                        listItem.classList.add('selected-project');
                    }

                    projectListContainer.appendChild(listItem);
                }
            }
        }

        const populateTasks = () => {
            const projectInfo = DataManager.getProjectTitleAndDescByIdx(selectedIndex);

            const projectNameEle = document.querySelector('#project-info-name');
            projectNameEle.innerText = projectInfo.title;

            const projectDescEle = document.querySelector('#project-info-desc');
            projectDescEle.innerText = projectInfo.description;

            // Create a template element and populate with the HTML
            // contained in the 'task-template.html' FILE
            const taskTemplateElement = document.createElement('template');
            taskTemplateElement.innerHTML = taskTemplate;

            // Clear tasklist
            taskList.innerHTML = ""

            // Get object literals of all tasks for this project
            let taskInfo = DataManager.getProjectTasks(selectedIndex);

            if (taskInfo.length === 0) {
                // There are no tasks to sort, so nothing else to do here
                const incompleteHeader = document.createElement('h3');
                incompleteHeader.innerText = 'No Tasks to Display...';
                incompleteHeader.classList.add('task-list-header-label');
                taskList.appendChild(incompleteHeader);
            } else {
                let sorted = null;

                //  Sort the tasks by user selection
                if (taskSort === 'btn-task-sort-none') {
                    sorted = taskInfo;
                } else if (taskSort === 'btn-task-sort-duedate') {
                    const noDueDate = taskInfo.filter((task) => {
                        return (!task.hasDueDate);
                    })
                    const dueDateSorted = taskInfo.filter((task) => {
                        return (task.hasDueDate)
                    }).sort((a, b) => {
                        return ((new Date(a.dueDate)) - (new Date(b.dueDate)))
                    });
                    sorted = noDueDate.concat(dueDateSorted);
                } else if (taskSort === 'btn-task-sort-priority') {
                    sorted = taskInfo.sort((a, b) => {
                        return b.priority - a.priority
                    })
                }

                // Sort the sorted list by whether or not the task is complete
                // This is applied on top of all other sorts
                sorted = sorted.sort((a, b) => {
                    return (a.complete - b.complete);
                })

                // We want headers for complete and incomplete tasks
                let incompleteInserted = false;
                let completeInserted = false;
                for (const task of sorted) {
                    // Insert incomplete header BEFORE first incomplete task encounted
                    if ((!incompleteInserted) && (!task.complete)) {
                        const incompleteHeader = document.createElement('h3');
                        incompleteHeader.innerText = 'Incomplete Tasks';
                        incompleteHeader.classList.add('task-list-header-label');
                        taskList.appendChild(incompleteHeader);
                        incompleteInserted = true;
                    }

                    // Insert complete header BEFORE first complete task encountered
                    if ((!completeInserted) && (task.complete)) {
                        const completeHeader = document.createElement('h3');
                        completeHeader.innerText = "Complete Tasks";
                        completeHeader.classList.add('task-list-header-label');
                        taskList.appendChild(completeHeader);
                        completeInserted = true;
                    }

                    // Clone the node, build it then append it
                    const clonedNode = taskTemplateElement.content.cloneNode(true);
                    const node = buildTask(task, clonedNode);
                    taskList.appendChild(node);
                }
            }
        }

        const buildTask = (task, node) => {

            // Set checkbox display
            const checkBox = node.querySelector('.task-item-checkbox');
            if (task.complete) {
                checkBox.src = imgChecked;
            } else {
                checkBox.src = imgUnChecked;
            }

            // Set the id of the Task Item
            const item = node.querySelector('.task-item');
            item.id = task.id;

            // Set task title
            const title = node.querySelector('.task-title-header');
            title.innerText = task.title;

            // Set the description
            const desc = node.querySelector('.task-desc');
            desc.innerText = task.description;

            // Set the notes
            const notes = node.querySelector('.task-notes');
            notes.innerText = task.notes;

            // Save priority is an integer
            // Get the name of the priority, set it
            // Then set element to correct color
            const priority = node.querySelector('.task-priority-info');
            priority.innerText = DataManager.priorityNames[task.priority];
            priority.style.border = `1px solid ${DataManager.priorityColors[task.priority].border}`;
            priority.style.backgroundColor = `${DataManager.priorityColors[task.priority].background}`;
            priority.style.color = `${DataManager.priorityColors[task.priority].font}`;

            // Get refs to due date information
            const dueDateLabel = node.querySelector('.task-due-date-label');
            const dueDateInfo = node.querySelector('.task-due-date-info');

            const hasDueDate = task.hasDueDate;

            if (hasDueDate) {
                // Get due date and set label
                const taskDueDate = task.dueDate;
                dueDateLabel.innerText = `Due ${taskDueDate}`;

                // use 'date-fns' to a human readable distance to that date
                const dateObj = new Date(taskDueDate);
                const distance = formatDistanceToNow(dateObj);

                // get todays date to check if task is due today
                const now = new Date();
                const sameDay = isSameDay(dateObj, now);

                // Create vars to hold the final background and font colors
                let dueBackground;
                let dueFont;

                if (sameDay) {
                    dueDateInfo.innerText = "Due Today";
                    dueBackground = DataManager.dueDateColors.today.background;
                    dueFont = DataManager.dueDateColors.today.font;
                } else {
                    // Task is NOT due today
                    // Find out if it was due in the past or will be due in the future
                    const compare = compareAsc(dateObj, now);
                    if (compare === -1) {
                        // Due date is BEFORE todays date
                        dueDateInfo.innerText = `Overdue by ${distance}`;
                        dueBackground = DataManager.dueDateColors.overdue.background;
                        dueFont = DataManager.dueDateColors.overdue.font;
                    } else if (compare === 1) {
                        // Due date is AFTER todays date
                        dueDateInfo.innerText = `Due in ${distance}`;
                        dueBackground = DataManager.dueDateColors.upcoming.background;
                        dueFont = DataManager.dueDateColors.upcoming.font;
                    }
                }

                // Set font and background colors of due date elements
                dueDateLabel.style.backgroundColor = dueBackground;
                dueDateLabel.style.color = dueFont
                dueDateInfo.style.backgroundColor = dueBackground;
                dueDateInfo.style.color = dueFont;
            } else {
                // No due date, set appropiately
                dueDateLabel.innerText = "No Due Date";
                dueDateInfo.innerText = "";
                dueDateLabel.style.border = '1px solid var(--font-color)';
            }
            return node;
        }

        // Called when the user selects a project from the project side bar
        const updateSelectedProject = (projectId = null) => {
            if (DataManager.getProjectCount() > 0) {
                // Get the id of currently selected project
                const oldProjectId = DataManager.getProjectIdByIdx(selectedIndex);
                // Verify current project wasn't clicked again
                if (!(projectId === oldProjectId) && (!(projectId === null))) {
                    // Update classlist and selectedIndex
                    document.getElementById(projectId).classList.add('selected-project');
                    document.getElementById(oldProjectId).classList.remove('selected-project');
                    selectedIndex = DataManager.getProjectIdxById(projectId);
                } else {
                    if (!(document.getElementById(oldProjectId).classList.contains('selected-project'))) {
                        document.getElementById(oldProjectId).classList.add('selected-project');
                    }
                }
                // Rebuild tasks
                populateTasks();
            }
        }

        // Kinda jenky but couldn't find a super easy way to compare 2 date
        // objects to detect if they are the same day
        // Comparing the date objects directly will only return TRUE
        // if they are perfectly identical, like down to the second, or maybe
        // even millisecond, or god forbid mirco second
        const isSameDay = (date1, date2) => {
            return date1.getFullYear() === date2.getFullYear() &&
                date1.getMonth() === date2.getMonth() &&
                date1.getDate() === date2.getDate();
        }

        // Goal is the have 'init' method be the ONLY thing called from the global scope
        return {
            init,
        }
    }
)();

export { Manager }