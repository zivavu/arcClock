import { ctx, mouseHistoryLimit } from './canvas.js';
import {
    attractAllParticles,
    repelAllParticles,
    resetSParticlesIsAttracted,
} from './clockHands/secHandParticles/particleManager.js';
import { normFloat } from './utlis.js';

const canvas = document.getElementById('main-canvas') as HTMLCanvasElement;

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
            ctx.arc(
                Math.round(point.x),
                Math.round(point.y),
                Math.max(rippleWidth - i * 2, 1),
                0,
                Math.PI * 2
            );
            ctx.closePath();
            ctx.lineWidth = Math.max(5 - i, 1);
            ctx.stroke();
        }
    });
}

export function updateMouseAttachPoints() {
    if (isMouseDown) {
        [...mouseHistory, mouse].forEach((pos, i) => {
            attractAllParticles(pos.x, pos.y, 0.6 + i * 0.4, 60 + i * (80 / mouseHistoryLimit));
            if (i === 0) {
                attractAllParticles(pos.x, pos.y, 0.3, 140);
            }
        });
    }
}

//# sourceMappingURL=mouseManager.js.map
