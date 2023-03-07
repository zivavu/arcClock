import { drawClock } from '../clock/clock.js';
import { mouseHistory } from '../mouseManager/mouseManager.js';
import { drawMS, updateMS } from '../msHand/msHand.js';
import { createSParticles, updateSParticles } from '../sHandParticles/particleManager.js';
import { prevS, seconds, updateDate } from '../timeManager/timeManager.js';

export const canvas = document.getElementById('canvas') as HTMLCanvasElement;
export const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

//Config variables
export const msArcsLimit = 30;
export const msLinesLimit = 10;
export const msMainOffset = 30;

export let cloackWidth: number;
export let centerScreenPoint: { x: number; y: number };

const framerate = 1000 / 60;

window.addEventListener('resize', setDimentions);
function setDimentions() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    cloackWidth = canvas.height / 2.3;
    centerScreenPoint = {
        x: canvas.width / 2,
        y: canvas.height / 2,
    };
    updateDate();
    draw();
}

const frameInterval = setInterval(update, framerate);

function update() {
    updateDate();
    draw();
}

function draw() {
    if (document.hidden) return;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawClock();
    updateMS();
    drawMS();
    if (seconds !== prevS) {
        createSParticles();
    }
    updateSParticles();
    // drawMouseHistory();
}

function drawMouseHistory() {
    mouseHistory.forEach((point) => {
        ctx.beginPath();
        ctx.fillStyle = `yellow`;
        ctx.fillRect(point.x, point.y, 20, 20);
        ctx.closePath();
        ctx.fillStyle = `black`;
    });
}

setDimentions();
