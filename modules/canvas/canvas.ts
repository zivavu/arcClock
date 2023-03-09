import { drawClock } from '../clock/clock.js';
import { drawH, upadteH } from '../clockHands/hourHand/hourHand.js';
import { drawMin, updateMin } from '../clockHands/minHand/minHand.js';
import { drawMS, updateMS } from '../clockHands/msHand/msHand.js';
import {
    createSParticles,
    drawSParticles,
    updateSParticles,
} from '../clockHands/secHandParticles/particleManager.js';
import {
    drawMouseHistory,
    mouse,
    mouseHistory,
    updateMouseRepelPoints,
} from '../mouseManager/mouseManager.js';
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
export const minLineWidthDevider = 3;
export const minRepelPower = 0.3;

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
}

const frameInterval = setInterval(() => {
    update();
    draw();
}, framerate);

function update() {
    if (document.hidden) return;
    updateDate();
    // updateMS();
    // if (seconds !== prevS) {
    //     createSParticles();
    // }
    // updateSParticles();
    // updateMouseRepelPoints();
    // updateMin();
    upadteH();
}

function draw() {
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawClock();
    // drawMouseHistory();
    // drawMS();
    // drawSParticles();
    // drawMin();
    drawH();
}

setDimentions();
