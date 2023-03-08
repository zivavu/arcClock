import { centerScreenPoint, cloackWidth, ctx } from './../../canvas/canvas.js';
import { hourRad } from './../../timeManager/timeManager.js';

export let hCenter: {
    x: number;
    y: number;
};

let hoursRoot: {
    x: number;
    y: number;
    branches: { x: number; y: number }[];
    branchesTarget: { x: number; y: number }[];
}[] = [];

export function upadteH() {
    hoursRoot = [];
    const offset = {
        x: cloackWidth * Math.cos(hourRad),
        y: cloackWidth * Math.sin(hourRad),
    };
    hCenter = {
        x: centerScreenPoint.x + offset.x,
        y: centerScreenPoint.y + offset.y,
    };
    const dir = {
        x: -Math.cos(hourRad),
        y: -Math.sin(hourRad),
    };
    hoursRoot.push({ ...hCenter, branches: [], branchesTarget: [] });
    for (let i = 0; i < 1; i++) {
        const prevRoot = hoursRoot[i];
        hoursRoot.push({
            x: prevRoot.x + dir.x * i * 3,
            y: prevRoot.y + dir.y * i * 3,
            branches: [],
            branchesTarget: [],
        });
        const currentRoot = hoursRoot[i];
        const startAngle = Math.random() * 30;
        let prevPoint = { x: currentRoot.x, y: currentRoot.y };
        if (currentRoot.branches[0]) generateNewAnglePoints(currentRoot, prevPoint, dir);
    }
}
function generateNewAnglePoints(currentRoot, prevPoint, dir) {
    for (let j = 0; j < 100; j++) {
        const angle = j * 0.9 * Math.PI;
        const randomXOffset = (Math.random() * 0.4 - 0.2) * dir.x;
        const randomYOffset = (Math.random() * 0.4 - 0.2) * dir.y;
        const x = prevPoint.x + randomXOffset * angle * Math.cos(angle) * dir.x;
        const y = prevPoint.y + randomYOffset * angle * Math.sin(angle) * dir.y;
        currentRoot.branches.push({ x: x, y: y });
        prevPoint = { x: x, y: y };
    }
}

export function drawH() {
    ctx.moveTo(hCenter.x, hCenter.y);
    for (let i = 0; i < hoursRoot.length; i++) {
        const current = hoursRoot[i];
        const { x, y, branches } = current;
        ctx.strokeStyle = 'white';
        ctx.lineWidth = i / 3;
        ctx.beginPath();
        ctx.arc(x, y, i, 0, Math.PI * 2);
        ctx.stroke();
        for (let j = 0; j < branches.length; j++) {
            const current = branches[j];
            const { x, y } = current;
            ctx.beginPath();
            ctx.arc(x, y, j / 100, 0, Math.PI * 2);
            ctx.stroke();
        }
    }

    ctx.closePath();
}
