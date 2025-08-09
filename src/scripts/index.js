import "/src/css/reset.css";
import "/src/css/styles.css";

import bg_image from "/src/images/background.jpg";

// index.js
import { greeting } from "./greeting.js";

import Task from "./task.js";

console.log(greeting);

const myTask = new Task('My New Task');

console.log(myTask.getTaskInfo());
myTask.markComplete();
console.log(myTask.getTaskInfo());
console.log(myTask.getId());

const info = myTask.getTaskInfo();

myTask.updateTaskInfo(info.title, "A new desc", info.hasDueDate, info.dueDate, info.priorityValue, "A new note", info.checklist);
console.log(myTask.getTaskInfo());

const body = document.querySelector('body');
const img = document.createElement('img');
img.src = bg_image;
body.appendChild(img);
