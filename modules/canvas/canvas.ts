import { drawClock } from '../clock/clock.js';
import { drawMin, updateMin } from '../minHand/minHand.js';
import { mouse, mouseHistory } from '../mouseManager/mouseManager.js';
import { drawMS, updateMS } from '../msHand/msHand.js';
import { createSParticles, drawSParticles, updateSParticles } from '../secHandParticles/particleManager.js';
import { prevS, seconds, updateDate } from '../timeManager/timeManager.js';

export const canvas = document.getElementById('canvas') as HTMLCanvasElement;
export const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

//Config variables
export const msArcsLimit = 30;
export const msLinesLimit = 10;
export const msMainOffset = 30;

export const minArcsLimit = 5;
export const minSegmentsLimit = 15;
export const minMainOffset = 20;
export const minDirMultiplier = 18;
export const minLineWidthDevider = 4;
export const minRepelPower = 0.5;

export const mouseHistoryLimit = 17;

export let cloackWidth: number;
export let centerScreenPoint: { x: number; y: number };

const framerate = 1000 / 60;

window.addEventListener('resize', setDimentions);
function setDimentions() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    cloackWidth = Math.min(canvas.height / 2.3, canvas.width / 2.3);
    centerScreenPoint = {
        x: canvas.width / 2,
        y: canvas.height / 2,
    };
    updateDate();
    draw();
}

const frameInterval = setInterval(update, framerate);

function update() {
    if (document.hidden) return;
    updateDate();
    updateMS();
    if (seconds !== prevS) {
        createSParticles();
    }
    updateSParticles();
    updateMin();
    draw();
}

function draw() {
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawClock();
    drawMS();
    drawSParticles();
    drawMin();
    // drawMouseHistory();
}

function drawMouseHistory() {
    [...mouseHistory, mouse].forEach((point) => {
        ctx.beginPath();
        ctx.fillStyle = `yellow`;
        ctx.fillRect(point.x, point.y, 20, 20);
        ctx.closePath();
        ctx.fillStyle = `black`;
    });
}

setDimentions();
