const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

window.addEventListener('resize', setDimentions);
let cloackWidth = canvas.width;
function setDimentions() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    draw();
}
setDimentions();

let hours: number, minutes: number, seconds: number, milliseconds: number;
function updateDate() {
    const date = new Date();
    hours = date.getHours();
    minutes = date.getMinutes();
    seconds = date.getSeconds();
    milliseconds = date.getMilliseconds();
}
const framerate = 60 / 1000;
let currentFrame = 0;

const secInterval = setInterval(update, framerate);

function update() {
    updateDate();
    currentFrame++;
    if (currentFrame >= 60) {
        currentFrame = 0;
    }
}

function draw() {
    ctx.beginPath();
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 5;
    const centerWidth = canvas.width / 2;
    const centerHeight = canvas.height / 2;
    ctx.arc(centerWidth, centerHeight, cloackWidth, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.beginPath();
}
draw();

console.log(canvas.width, canvas.height);
