import { ctx, mouseHistoryLimit } from '../canvas/canvas.js';
import {
    repelAllParticles,
    resetSParticlesIsAttracted,
} from '../clockHands/secHandParticles/particleManager.js';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;

export let isMouseDown = false;
export let mouse = {
    x: 0,
    y: 0,
};

canvas.onmouseup = () => {
    resetSParticlesIsAttracted();
    isMouseDown = false;
    repelParticlesFromAllMousePoints();
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

function repelParticlesFromAllMousePoints() {
    [...mouseHistory, mouse].forEach((pos) => {
        repelAllParticles(pos.x, pos.y, 1, 200);
    });
}
export function drawMouseHistory() {
    const rippleWidth = 25;
    [...mouseHistory].forEach((point) => {
        for (let i = 0; i < 15; i++) {
            const opacity = i < 5 ? 0.035 * i : 0.07 * i;
            const shade = 80 + i * 10;
            ctx.strokeStyle = `rgba(${shade}, ${shade}, ${shade}, ${opacity})`;
            ctx.beginPath();
            ctx.arc(point.x, point.y, Math.max(rippleWidth - i * 2, 1), 0, Math.PI * 2);
            ctx.closePath();
            ctx.lineWidth = Math.max(5 - i, 1);
            ctx.stroke();
        }
    });
}

//# sourceMappingURL=mouseManager.js.map
