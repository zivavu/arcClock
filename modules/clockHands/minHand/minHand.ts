import {
    centerScreenPoint,
    cloackWidth,
    ctx,
    minArcsLimit,
    minDirMultiplier,
    minLineWidthDevider,
    minMainOffset,
    minRepelPower,
    minSegmentsLimit,
} from '../../canvas/canvas.js';
import { minRad } from '../../timeManager/timeManager.js';
import { repelAllParticles } from '../secHandParticles/particleManager.js';
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

    for (let i = 0; i < minArcsLimit; i++) {
        arcs.push([]);
        const currentBranch = arcs[i];
        currentBranch.push({ x: minCenter.x, y: minCenter.y });
        for (let j = 0; j < minSegmentsLimit; j++) {
            const { x: prevX, y: prevY } = currentBranch[j];

            const randomXOffset = Math.random() * minMainOffset * 2 - minMainOffset;
            const randomYOffset = Math.random() * minMainOffset * 2 - minMainOffset;
            const randomXDirection = (Math.random() * minDirMultiplier - minDirMultiplier * 2) * dir.x;
            const randomYDirection = (Math.random() * minDirMultiplier - minDirMultiplier * 2) * dir.y;

            const newX = prevX + randomXOffset + randomXDirection;
            const newY = prevY + randomYOffset + randomYDirection;
            currentBranch.push({ x: newX, y: newY });
        }
        const { x: lastSegmentX, y: lastSegmentY } = currentBranch[currentBranch.length - 1];
        repelAllParticles(lastSegmentX, lastSegmentY, minRepelPower, 40, true);
    }
}

export function drawMin() {
    for (let j = 0; j < minArcsLimit; j++) {
        ctx.beginPath();
        const currentBranch = arcs[j];
        for (let k = 0; k < currentBranch.length - 1; k++) {
            ctx.lineWidth = (minSegmentsLimit - k) / minLineWidthDevider;
            ctx.moveTo(currentBranch[k].x, currentBranch[k].y);
            ctx.lineTo(currentBranch[k + 1].x, currentBranch[k + 1].y);
            ctx.stroke();
        }
        const { x: lastSegmentX, y: lastSegmentY } = currentBranch[currentBranch.length - 1];
        ctx.fillStyle = `white`;
        ctx.beginPath();
        ctx.arc(lastSegmentX, lastSegmentY, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = `black`;
        ctx.closePath();
    }
}
