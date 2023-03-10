import { drawClock } from './clock.js';
import { drawH, hourCanvas, upadteH } from './clockHands/hourHand/hourHand.js';
import { drawMin, updateMin } from './clockHands/minHand/minHand.js';
import { drawMS, updateMS } from './clockHands/msHand/msHand.js';
import {
    createSParticles,
    drawSParticles,
    updateSParticles,
} from './clockHands/secHandParticles/particleManager.js';
import { drawMouseHistory, updateMouseAttachPoints } from './mouseManager.js';
import { prevS, seconds, updateDate } from './timeManager.js';

export const canvas = document.getElementById('main-canvas') as HTMLCanvasElement;
export const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

//Config variables
export const msArcsLimit = 18;
export const msLinesLimit = 6;
export const msMainOffset = 35;

export const minArcsLimit = 5;
export const minSegmentsLimit = 15;
export const minMainOffset = 20;
export const minDirMultiplier = 18;
export const minLineWidthDevider = 3;
export const minRepelPower = 0.3;

export const mouseHistoryLimit = 17;

export let cloackWidth: number;
export let centerScreenPoint: { x: number; y: number };

export let forceUpdate = false;

const framerate = 1000 / 60;

window.addEventListener('resize', setDimentions);
function setDimentions() {
    forceUpdate = true;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    hourCanvas.width = window.innerWidth;
    hourCanvas.height = window.innerHeight;
    cloackWidth = Math.min(canvas.height / 2.3, canvas.width / 2.3);
    centerScreenPoint = {
        x: canvas.width / 2,
        y: canvas.height / 2,
    };
    update();
    draw();
    forceUpdate = false;
}

const frameInterval = setInterval(() => {
    console.time('frame');
    update();
    draw();
    console.timeEnd('frame');
}, framerate);

function update() {
    if (document.hidden) return;
    updateDate();
    updateMS();
    if (seconds !== prevS) {
        createSParticles();
    }
    updateSParticles();
    updateMouseAttachPoints();
    updateMin();
    upadteH();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawH();
    drawClock();
    drawMouseHistory();
    drawMS();
    drawMin();
    drawSParticles();
}

setDimentions();
