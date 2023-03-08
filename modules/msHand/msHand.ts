import {
    centerScreenPoint,
    cloackWidth,
    ctx,
    msArcsLimit,
    msLinesLimit,
    msMainOffset,
} from '../canvas/canvas.js';
import { milliseconds, msRad } from '../timeManager/timeManager.js';
let arcs: { x: number; y: number }[][][] = [];

export let msCenter: {
    x: number;
    y: number;
};
export function updateMS() {
    const offset = {
        x: cloackWidth * Math.cos(msRad),
        y: cloackWidth * Math.sin(msRad),
    };
    msCenter = {
        x: centerScreenPoint.x + offset.x,
        y: centerScreenPoint.y + offset.y,
    };
    arcs.push([]);
    const currentRoot = arcs[arcs.length - 1];
    for (let i = 0; i < 6; i++) {
        currentRoot.push([{ x: msCenter.x, y: msCenter.y }]);
        const currentBranch = currentRoot[i];
        for (let j = 0; j < msLinesLimit; j++) {
            const { x: prevX, y: prevY } = currentBranch[j];
            const newX = prevX + (Math.random() * msMainOffset - msMainOffset / 2);
            const newY = prevY + (Math.random() * msMainOffset - msMainOffset / 2);
            currentBranch.push({ x: newX, y: newY });
        }
    }
    if (arcs.length > msArcsLimit) {
        arcs.shift();
    }
}
export function drawMS() {
    for (let i = 0; i < arcs.length; i++) {
        const currentRoot = arcs[i];
        const opacity = ((i / msArcsLimit) * 0.4).toFixed(2);
        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
        for (let j = 0; j < currentRoot.length; j++) {
            const currentBranch = currentRoot[j];
            for (let k = 0; k < currentBranch.length - 1; k++) {
                ctx.beginPath();
                ctx.lineWidth = (msLinesLimit - k) / 2;
                ctx.moveTo(currentBranch[k].x, currentBranch[k].y);
                ctx.lineTo(currentBranch[k + 1].x, currentBranch[k + 1].y);
                ctx.stroke();
                ctx.closePath();
            }
        }
    }
}
