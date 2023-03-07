import { repelAllParticles, resetSParticlesIsAttracted } from '../sHandParticles/particleManager.js';

export const canvas = document.getElementById('canvas') as HTMLCanvasElement;
export const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

function drawMouseHistory() {
    mouseHistory.forEach((point) => {
        ctx.beginPath();
        ctx.fillStyle = `yellow`;
        ctx.fillRect(point.x, point.y, 20, 20);
        ctx.closePath();
        ctx.fillStyle = `black`;
    });
}

export let isMouseDown = false;
export let mouse = {
    x: 0,
    y: 0,
};
export let mouseHistory = [];
export const mouseHistoryLimit = 13;
let mouseHistoryInterval;
export function pushNewMousePoint() {
    mouseHistoryInterval = setInterval(() => {
        if (mouseHistory.some((pos) => Math.abs(pos.x - mouse.x) < 40 && Math.abs(pos.y - mouse.y) < 40)) {
            return;
        }
        if (mouseHistory.length >= mouseHistoryLimit) {
            mouseHistory.shift();
        }
        mouseHistory.push(Object.assign({}, mouse));
    }, 30);
}
canvas.onmouseup = () => {
    resetSParticlesIsAttracted();
    isMouseDown = false;
    repelAllParticles(mouse.x, mouse.y, 5, 250);
    mouseHistory = [];
    clearInterval(mouseHistoryInterval);
};
canvas.onmousedown = () => {
    isMouseDown = true;
    pushNewMousePoint();
};
canvas.onmousemove = (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
};
//# sourceMappingURL=mouseManager.js.map
