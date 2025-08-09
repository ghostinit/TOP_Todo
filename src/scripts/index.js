import "/src/css/reset.css";
import "/src/css/styles.css";

import bg_image from "/src/images/background.jpg";

// index.js
import { greeting } from "./greeting.js";

console.log(greeting);

const body = document.querySelector('body');
const img = document.createElement('img');
img.src = bg_image;
body.appendChild(img);
