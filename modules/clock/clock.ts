import { centerScreenPoint, cloackWidth, ctx } from '../canvas/canvas.js';

export function drawClock() {
    ctx.beginPath();
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 7;
    ctx.arc(centerScreenPoint.x, centerScreenPoint.y, cloackWidth, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.closePath();
    for (let i = 0; i < 60; i++) {
        const rad = (i * 2 * Math.PI) / 60 - 0.5 * Math.PI;
        const offset = {
            x: cloackWidth * Math.cos(rad),
            y: cloackWidth * Math.sin(rad),
        };
        const start = {
            x: centerScreenPoint.x + offset.x,
            y: centerScreenPoint.y + offset.y,
        };

        const dir = {
            x: -Math.cos(rad),
            y: -Math.sin(rad),
        };

        let markLength: number;
        ctx.lineCap = 'round';
        ctx.lineWidth = 4;
        markLength = 20;
        if (i % 5 === 0) {
            ctx.lineWidth = 6;
            markLength = 30;
        }
        if (i % 15 === 0) {
            ctx.lineWidth = 7;
            markLength = 32;
        }
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(start.x + dir.x * markLength, start.y + dir.y * markLength);
        ctx.stroke();
        ctx.closePath();
    }
}
