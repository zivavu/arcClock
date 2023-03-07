import { mouseHistoryLimit } from '../canvas/canvas.js';
import { repelAllParticles, resetSParticlesIsAttracted } from '../secHandParticles/particleManager.js';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;

export let isMouseDown = false;
export let mouse = {
    x: 0,
    y: 0,
};
export let mouseHistory: { x: number; y: number }[] = [];
let mouseHistoryInterval: ReturnType<typeof setInterval>;
export function pushNewMousePoint() {
    mouseHistoryInterval = setInterval(() => {
        if (mouseHistory.some((pos) => Math.abs(pos.x - mouse.x) < 40 && Math.abs(pos.y - mouse.y) < 40)) {
            return;
        }
        if (mouseHistory.length >= mouseHistoryLimit) {
            mouseHistory.shift();
        }
        mouseHistory.push(Object.assign({}, mouse));
    }, 40);
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
