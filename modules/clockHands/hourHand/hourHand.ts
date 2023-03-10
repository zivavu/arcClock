import { centerScreenPoint, cloackWidth, forceUpdate } from '../../canvas.js';
import { hourRad, prevHRad } from '../../timeManager.js';
import { normFloat } from '../../utils.js';

export const hourCanvas = document.getElementById('hour-canvas') as HTMLCanvasElement;
export const hourCtx = hourCanvas.getContext('2d') as CanvasRenderingContext2D;

export let hCenter: {
    x: number;
    y: number;
};

let hoursRoot: {
    x: number;
    y: number;
    branchesArr: { x: number; y: number }[][];
    branchesTarget: { x: number; y: number }[];
}[] = [];

export function upadteH() {
    if (prevHRad === hourRad && !forceUpdate) {
        return;
    }

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
    hoursRoot.push({ ...hCenter, branchesArr: [[{ ...hCenter }], [{ ...hCenter }]], branchesTarget: [] });

    for (let i = 0; i < 20; i++) {
        const prevRoot = hoursRoot[i];
        const newX = prevRoot.x + dir.x * i * 3.1;
        const newY = prevRoot.y + dir.y * i * 3.1;

        hoursRoot.push({
            x: newX,
            y: newY,
            branchesArr: [[]],
            branchesTarget: [],
        });

        const { branchesArr } = prevRoot;
        const branchLength = 90;

        if ((i >= 11 && i % 4 === 1) || i === 8) {
            let prevX = prevRoot.x,
                prevY = prevRoot.y;
            const direction = hourRad + 20 * (Math.PI / 180);

            for (let k = 0; k < branchLength; k++) {
                const angle = direction + k / 5;
                const offset = Math.max(5 + (i * 6 + (branchLength - k * 2.8)) / 14, 5 - k * 0.045);
                const newX = prevX + Math.cos(angle) * offset;
                const newY = prevY + Math.sin(angle) * offset;
                branchesArr[0].push({ x: newX, y: newY });
                prevX = newX;
                prevY = newY;
            }
            const newArr = JSON.parse(JSON.stringify(branchesArr[0]));
            branchesArr.push(mirrorParticles(newArr, newX, newY));
        }
        //Limits the number of segments to not exceed the center of the screeen
        if (
            (dir.x > 0 && newX > centerScreenPoint.x) ||
            (dir.x < 0 && newX < centerScreenPoint.x) ||
            (dir.y > 0 && newY > centerScreenPoint.y) ||
            (dir.y < 0 && newY < centerScreenPoint.y)
        ) {
            break;
        }
    }
}

export function drawH() {
    if (prevHRad === hourRad && !forceUpdate) {
        return;
    }
    hourCtx.clearRect(0, 0, hourCanvas.width, hourCanvas.height);
    hourCtx.moveTo(hCenter.x, hCenter.y);
    for (let i = 0; i < hoursRoot.length; i++) {
        const branchColor = `
        rgb(${Math.max(0, 200 - i * 7.5)},
        ${Math.max(0, 130 - i * 6)},
        ${Math.max(0, 240 - i * 7)})`;
        const current = hoursRoot[i];
        const { x, y, branchesArr } = current;
        hourCtx.lineWidth = Math.round(i / 3);
        hourCtx.fillStyle = branchColor;
        hourCtx.strokeStyle = branchColor;
        hourCtx.beginPath();
        hourCtx.arc(normFloat(x), normFloat(y), i, 0, Math.PI * 2);
        hourCtx.stroke();
        hourCtx.fill();
        hourCtx.closePath();
        hourCtx.moveTo(normFloat(x), normFloat(y));
        hourCtx.fillStyle = 'black';

        if (branchesArr[0][0]) {
            hourCtx.lineWidth = normFloat(0.2 + i / 10);
            hourCtx.strokeStyle = branchColor;
            for (let j = 0; j < 2; j++) {
                for (let k = 0; k < branchesArr[0].length; k++) {
                    const { x, y } = branchesArr[j][k];
                    const circleWidth = Math.max(normFloat(2 + i / 3 - k / 10), 0.3);
                    hourCtx.beginPath();
                    hourCtx.arc(normFloat(x), normFloat(y), normFloat(circleWidth), 0, Math.PI * 2);
                    hourCtx.stroke();
                    hourCtx.closePath();
                }
            }
        }
    }
}

function mirrorParticles(particles: { x: number; y: number }[], x0: number, y0: number) {
    for (let particle of particles) {
        let dx = particle.x - x0;
        let dy = particle.y - y0;
        let dist = Math.sqrt(dx * dx + dy * dy);
        let angle = Math.atan2(dy, dx);
        particle.x = x0 + dist * Math.cos(-angle + hourRad * 2);
        particle.y = y0 + dist * Math.sin(-angle + hourRad * 2);
    }
    return particles;
}
