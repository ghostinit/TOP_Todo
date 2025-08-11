import { DataManager } from "./dataManager";

const Manager = (
    function () {
        let selectedIndex = 0;

        const init = () => {
            // Fetch stored data or starter data
            DataManager.fetchStoredData();

            // Temporarily add another project
            DataManager.buildStarterData();

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
        }

        const updateSelectedProject = (projectId) => {
            const oldProjectId = DataManager.getProjectIdByIdx(selectedIndex);
            if (!(projectId === oldProjectId)) {
                document.getElementById(projectId).classList.add('selected-project');
                document.getElementById(oldProjectId).classList.remove('selected-project');
                selectedIndex = DataManager.getProjectIdxById(projectId);
            }
        }

        return {
            init,
        }
    }
)();

export { Manager }