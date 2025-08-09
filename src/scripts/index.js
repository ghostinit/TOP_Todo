import "/src/css/reset.css";
import "/src/css/styles.css";

import bg_image from "/src/images/background.jpg";

// index.js
import { greeting } from "./greeting.js";

import Task from "./task.js";

console.log(greeting);

const myTask = Task.getNewVanillaTask("Vanilla Task")

console.log(myTask.getTaskInfo())


const body = document.querySelector('body');
const img = document.createElement('img');
img.src = bg_image;
body.appendChild(img);
