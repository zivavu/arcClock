import {
    centerScreenPoint,
    cloackWidth,
    ctx,
    minDirMultiplier,
    minLinesLimit,
    minLineStartWidth,
    minMainOffset,
} from '../canvas/canvas.js';
import { repelAllParticles } from '../secHandParticles/particleManager.js';
import { minRad } from '../timeManager/timeManager.js';
export let minCenter: {
    x: number;
    y: number;
};

let arcs: { x: number; y: number }[][] = [];

export function updateMin() {
    arcs = [];
    const offset = {
        x: cloackWidth * Math.cos(minRad),
        y: cloackWidth * Math.sin(minRad),
    };
    minCenter = {
        x: centerScreenPoint.x + offset.x,
        y: centerScreenPoint.y + offset.y,
    };
    const dir = {
        x: Math.cos(minRad),
        y: Math.sin(minRad),
    };

    for (let i = 0; i < 6; i++) {
        arcs.push([]);
        const currentBranch = arcs[i];
        currentBranch.push({ x: minCenter.x, y: minCenter.y });
        for (let j = 0; j < minLinesLimit; j++) {
            const { x: prevX, y: prevY } = currentBranch[j];

            const randomXOffset = Math.random() * minMainOffset * 2 - minMainOffset;
            const randomYOffset = Math.random() * minMainOffset * 2 - minMainOffset;
            const randomXDirection = (Math.random() * minDirMultiplier - minDirMultiplier * 2) * dir.x;
            const randomYDirection = (Math.random() * minDirMultiplier - minDirMultiplier * 2) * dir.y;

            const newX = prevX + randomXOffset + randomXDirection;
            const newY = prevY + randomYOffset + randomYDirection;
            currentBranch.push({ x: newX, y: newY });
        }
    }
}
export function drawMin() {
    for (let j = 0; j < arcs.length; j++) {
        const currentBranch = arcs[j];
        for (let k = 0; k < currentBranch.length - 1; k++) {
            ctx.beginPath();
            ctx.lineWidth = (minLinesLimit - k) / 2;
            ctx.moveTo(currentBranch[k].x, currentBranch[k].y);
            ctx.lineTo(currentBranch[k + 1].x, currentBranch[k + 1].y);
            ctx.stroke();
            ctx.closePath();
        }
        const { x: lastSegmentX, y: lastSegmentY } = currentBranch[currentBranch.length - 1];
        repelAllParticles(lastSegmentX, lastSegmentY, 0.7, 30);
    }
}
