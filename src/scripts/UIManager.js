import { DataManager } from "./dataManager";
import taskTemplate from "../task-template.html";
import { formatDistanceToNow, compareAsc } from "date-fns";


import imgChecked from "../assets/icons/checkbox-marked-outline.svg";
import imgUnChecked from "../assets/icons/checkbox-blank-outline.svg";

const Manager = (
    function () {
        let selectedIndex = 0;
        let taskSort = 'btn-task-sort-none';

        const init = () => {
            // Fetch stored data or starter data
            DataManager.fetchStoredData();

            // Temporarily add another project
            DataManager.buildStarterData();

            const sortButtons = document.querySelectorAll('.btn-task-sort');
            for (let button of sortButtons) {
                button.addEventListener('click', (event) => {
                    taskSort = event.target.id;
                    for (let btn of sortButtons) {
                        btn.classList.remove('task-sort-active');
                    }
                    event.target.classList.add('task-sort-active');
                    populateTasks();
                })
            }

            populateProjects();
            populateTasks();
        }

        const populateProjects = () => {
            const projectsInfos = DataManager.getProjectTitlesAndIds();
            const projectListContainer = document.querySelector('#project-list-container');
            // const projectList = document.createElement('ul');
            // projectList.id = 'project-list';
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
                listItem.addEventListener('click', (event) => {
                    updateSelectedProject(event.target.id);
                })
            }
            // projectListContainer.appendChild(projectList);
        }

        const populateTasks = () => {
            const projectInfo = DataManager.getProjectTitleAndDescByIdx(selectedIndex);
            const projectNameEle = document.querySelector('#project-info-name');
            projectNameEle.innerText = projectInfo.title;

            const projectDescEle = document.querySelector('#project-info-desc');
            projectDescEle.innerText = projectInfo.description;

            const taskTemplateElement = document.createElement('template');
            taskTemplateElement.innerHTML = taskTemplate;

            const taskList = document.querySelector('#task-list');
            taskList.innerHTML = ""

            let taskInfo = DataManager.getProjectTasks(selectedIndex);



            const priorityNames = DataManager.getTaskPriorityNames();
            const priorityColors = DataManager.getTaskPriorityColors();
            const dueDateColors = DataManager.getDueDateColors();

            // taskInfo[1].dueDate = '08/23/2025';

            let sorted = null;
            // sorted = taskInfo;
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

            for (const task of sorted) {
                const node = taskTemplateElement.content.cloneNode(true);

                const checkBox = node.querySelector('.task-item-checkbox');
                if (task.complete) {
                    checkBox.src = imgChecked;
                } else {
                    checkBox.src = imgUnChecked;
                }

                const item = node.querySelector('.task-item');
                item.id = task.id;

                const title = node.querySelector('.task-title-header');
                title.innerText = task.title;

                const desc = node.querySelector('.task-desc');
                desc.innerText = task.description;

                const notes = node.querySelector('.task-notes');
                notes.innerText = task.notes;

                const priority = node.querySelector('.task-priority-info');
                priority.innerText = priorityNames[task.priority];
                priority.style.border = `1px solid ${priorityColors[task.priority].border}`;
                priority.style.backgroundColor = `${priorityColors[task.priority].background}`;
                priority.style.color = `${priorityColors[task.priority].font}`;

                const dueDateLabel = node.querySelector('.task-due-date-label');
                const dueDateInfo = node.querySelector('.task-due-date-info');

                const hasDueDate = task.hasDueDate;
                if (hasDueDate) {
                    const taskDueDate = task.dueDate;
                    dueDateLabel.innerText = `Due ${taskDueDate}`;
                    const dateObj = new Date(taskDueDate);
                    const distance = formatDistanceToNow(dateObj);
                    const now = new Date();
                    const sameDay = isSameDay(dateObj, now);
                    let dueBackground;
                    let dueFont;
                    if (sameDay) {
                        dueDateInfo.innerText = "Due Today";
                        dueBackground = dueDateColors.today.background;
                        dueFont = dueDateColors.today.font;
                    } else {
                        const compare = compareAsc(dateObj, now);
                        if (compare === -1) {
                            dueDateInfo.innerText = `Overdue by ${distance}`;
                            dueBackground = dueDateColors.overdue.background;
                            dueFont = dueDateColors.overdue.font;
                        } else if (compare === 1) {
                            dueDateInfo.innerText = `Due in ${distance}`;
                            dueBackground = dueDateColors.upcoming.background;
                            dueFont = dueDateColors.upcoming.font;
                        }
                    }
                    dueDateLabel.style.backgroundColor = dueBackground;
                    dueDateLabel.style.color = dueFont
                    dueDateInfo.style.backgroundColor = dueBackground;
                    dueDateInfo.style.color = dueFont;
                } else {
                    dueDateLabel.innerText = "No Due Date";
                    dueDateInfo.innerText = "";
                    dueDateLabel.style.border = '1px solid var(--font-color)';
                }



                taskList.appendChild(node);
            }



        }

        const updateSelectedProject = (projectId) => {
            const oldProjectId = DataManager.getProjectIdByIdx(selectedIndex);
            if (!(projectId === oldProjectId)) {
                document.getElementById(projectId).classList.add('selected-project');
                document.getElementById(oldProjectId).classList.remove('selected-project');
                selectedIndex = DataManager.getProjectIdxById(projectId);
            }
        }

        const isSameDay = (date1, date2) => {
            return date1.getFullYear() === date2.getFullYear() &&
                date1.getMonth() === date2.getMonth() &&
                date1.getDate() === date2.getDate();
        }

        return {
            init,
        }
    }
)();

export { Manager }