import { canvas, centerScreenPoint, cloackWidth, ctx } from '../canvas/canvas.js';
import { repelAllParticles } from '../secHandParticles/particleManager.js';
import { minRad } from '../timeManager/timeManager.js';

export let minCenter: {
    x: number;
    y: number;
};

export function updateMin() {
    const offset = {
        x: cloackWidth * Math.cos(minRad),
        y: cloackWidth * Math.sin(minRad),
    };
    minCenter = {
        x: centerScreenPoint.x + offset.x,
        y: centerScreenPoint.y + offset.y,
    };
}
export function drawMin() {
    const dir = {
        x: Math.cos(minRad),
        y: Math.sin(minRad),
    };

    ctx.beginPath();
    ctx.moveTo(minCenter.x, minCenter.y);
    for (let i = 0; i < 12; i++) {
        minCenter.x = minCenter.x - Math.random() * (60 + i) * dir.x;
        minCenter.y = minCenter.y - Math.random() * (60 + i) * dir.y;
        ctx.lineTo(minCenter.x, minCenter.y);
        ctx.stroke();
    }
    ctx.closePath();
    repelAllParticles(minCenter.x, minCenter.y, 1, 40);
}
