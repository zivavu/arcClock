import { centerScreenPoint, cloackWidth, ctx } from './../../canvas/canvas.js';
import { hourRad } from './../../timeManager/timeManager.js';

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

    for (let i = 0; i < 50; i++) {
        const prevRoot = hoursRoot[i];
        const newX = prevRoot.x + dir.x * i * 2.8;
        const newY = prevRoot.y + dir.y * i * 2.8;

        //Limits the number of segments to not exceed the center of the screeen
        if (
            (dir.x > 0 && newX > centerScreenPoint.x) ||
            (dir.x < 0 && newX < centerScreenPoint.x) ||
            (dir.y > 0 && newY > centerScreenPoint.y) ||
            (dir.y < 0 && newY < centerScreenPoint.y)
        ) {
            break;
        }

        hoursRoot.push({
            x: newX,
            y: newY,
            branchesArr: [[], []],
            branchesTarget: [],
        });

        const branchRad = hourRad + 35 * (Math.PI / 180);
        const { branchesArr } = prevRoot;
        const branchLength = 70;

        if (i >= 6 && i % 4 === 0) {
            for (let j = 0; j < 2; j++) {
                let prevX = prevRoot.x,
                    prevY = prevRoot.y;
                let direction = j % 2 === 1 ? branchRad : branchRad + 180 * (Math.PI / 180);

                for (let k = 0; k < branchLength; k++) {
                    const angle = direction + (k / 5) * 1;
                    const offset = 3 + ((branchLength - k) * 0.8 * i) / 40;
                    const newX = prevX + Math.cos(angle) * offset;
                    const newY = prevY + Math.sin(angle) * offset;
                    branchesArr[j].push({ x: newX, y: newY });
                    prevX = newX;
                    prevY = newY;
                }
            }
        }
    }
}

export function drawH() {
    ctx.moveTo(hCenter.x, hCenter.y);
    for (let i = 0; i < hoursRoot.length; i++) {
        const current = hoursRoot[i];
        const { x, y, branchesArr } = current;
        ctx.strokeStyle = 'white';
        ctx.lineWidth = i / 3;
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(x, y, i, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
        ctx.stroke();
        ctx.moveTo(x, y);
        ctx.fillStyle = 'black';

        if (branchesArr[0]) {
            for (let j = 0; j < 2; j++) {
                for (let k = 0; k < branchesArr[0].length; k++) {
                    const { x, y } = branchesArr[j][k];
                    ctx.lineWidth = i / 8;
                    ctx.beginPath();
                    const circleWidth = Math.max(i / 3 - k / 7, 3);
                    ctx.arc(x, y, circleWidth, 0, Math.PI * 2);
                    ctx.closePath();
                    ctx.stroke();
                }
            }
        }
    }
}
