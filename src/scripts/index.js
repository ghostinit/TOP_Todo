import "/src/css/reset.css";
import "/src/css/variables.css";
import "/src/css/layout.css";
import "/src/css/styles.css";

import bg_image from "/src/images/background.jpg";

// index.js
import { greeting } from "./greeting.js";

import { load as loadStorage } from "./storageManager.js";

console.log(greeting);

loadStorage();

// const myProject = Project.getNewProject("My Project");

// for (let i = 0; i < 5; i++) {
//     const newTask = Task.getNewVanillaTask(`Task: ${i}`);
//     myProject.addTask(newTask);
// }

// const taskToRemove = myProject.getTaskByIndex(3);

// myProject.removeTask(taskToRemove);

// console.log(myProject.getProjectInfo());


// const body = document.querySelector('body');
// const img = document.createElement('img');
// img.src = bg_image;
// body.appendChild(img);
