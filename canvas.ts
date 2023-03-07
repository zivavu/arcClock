const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

window.addEventListener('resize', setDimentions);
let centerPoint: { x: number; y: number };

function setDimentions() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    cloackWidth = canvas.height / 2.5;
    centerPoint = {
        x: canvas.width / 2,
        y: canvas.height / 2,
    };
    updateDate();
    draw();
}

const msArcsLimit = 30;
const msLinesLimit = 10;
let cloackWidth = canvas.height / 2.5;

let hours: number, minutes: number, seconds: number, milliseconds: number;
let prevS: number;
function updateDate() {
    const date = new Date();
    hours = date.getHours();
    minutes = date.getMinutes();
    prevS = seconds;
    seconds = date.getSeconds();
    milliseconds = date.getMilliseconds();
    updateRadians();
}

let hRad: number, mRad: number, sRad: number, msRad: number;
function updateRadians() {
    msRad = (milliseconds * 2 * Math.PI) / 1000 - 0.5 * Math.PI;
    sRad = (seconds * 2 * Math.PI) / 60 - 0.5 * Math.PI;
}

let arcs: { x: number; y: number }[][][] = [];
const framerate = 1000 / 60;
const secInterval = setInterval(update, framerate);

function update() {
    updateDate();
    draw();
}

function draw() {
    if (document.hidden) return;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawClock();
    updateMS();
    drawMS();
    if (seconds !== prevS) {
        createSParticles();
    }
    updateSParticles();
    // drawMouseHistory();
}

function drawMouseHistory() {
    mouseHistory.forEach((point) => {
        ctx.beginPath();
        ctx.fillStyle = `yellow`;
        ctx.fillRect(point.x, point.y, 20, 20);
        ctx.closePath();
        ctx.fillStyle = `black`;
    });
}

function drawClock() {
    ctx.beginPath();
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 7;
    ctx.arc(centerPoint.x, centerPoint.y, cloackWidth, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.closePath();
    for (let i = 0; i < 60; i++) {
        const rad = (i * 2 * Math.PI) / 60 - 0.5 * Math.PI;
        const offset = {
            x: cloackWidth * Math.cos(rad),
            y: cloackWidth * Math.sin(rad),
        };
        const start = {
            x: centerPoint.x + offset.x,
            y: centerPoint.y + offset.y,
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

const msMainOffset = 30;
let msCenter: {
    x: number;
    y: number;
};
function updateMS() {
    const offset = {
        x: cloackWidth * Math.cos(msRad),
        y: cloackWidth * Math.sin(msRad),
    };
    msCenter = {
        x: centerPoint.x + offset.x,
        y: centerPoint.y + offset.y,
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
function drawMS() {
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

class SecondParticle {
    x: number;
    y: number;
    dirX: number;
    dirY: number;
    velocity: number;
    size: number;
    opacity: number;
    lifeTime: number;
    isAttracted: boolean;

    constructor(spawnPoint: { x: number; y: number }) {
        this.x = spawnPoint.x;
        this.y = spawnPoint.y;
        this.dirX = -Math.cos(sRad) + Math.random() * 0.3 - 0.15;
        this.dirY = -Math.sin(sRad) + Math.random() * 0.3 - 0.15;
        this.velocity = Math.random() * 7;
        this.size = Math.random() * 10 + 2;
        this.opacity = 1;
        this.lifeTime = 0;
        this.isAttracted = false;
    }

    update() {
        this.x += this.dirX * this.velocity;
        this.y += this.dirY * this.velocity;
        this.opacity -= 0.003;
        this.size += 0.03;
        this.lifeTime++;
        if (!this.isAttracted) this.velocity *= 1.006;

        if (
            this.x + this.size < 0 ||
            this.x - this.size > canvas.width ||
            this.y + this.size < 0 ||
            this.y - this.size > canvas.height
        ) {
            particles.splice(particles.indexOf(this), 1);
        }
        if (this.opacity <= 0) {
            particles.splice(particles.indexOf(this), 1);
        }
    }

    draw() {
        ctx.strokeStyle = `rgba(255, 255, 255, ${this.opacity}`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.lineWidth = 3;
        ctx.fill();
        ctx.stroke();
    }

    repel(x: number, y: number, power: number, range: number) {
        if (Math.abs(x - this.x) > range || Math.abs(y - this.y) > range) return;
        if (this.lifeTime < 60) power *= 0.1;

        const forceX = (x - this.x) / 100 / (this.size / 3);
        const forceY = (y - this.y) / 100 / (this.size / 3);
        this.dirX -= forceX * power;
        this.dirY -= forceY * power;
        if (!this.isAttracted) this.velocity += (Math.abs(forceX) + Math.abs(forceY)) * (power * 5);
    }
    attract(x: number, y: number, power: number, range: number) {
        if (Math.abs(x - this.x) > range || Math.abs(y - this.y) > range) {
            return;
        }
        this.isAttracted = true;

        const forceX = (x - this.x) / 100 / (this.size / 5);
        const forceY = (y - this.y) / 100 / (this.size / 5);

        this.dirX += forceX * power;
        this.dirY += forceY * power;
        if (this.dirX > 1) this.dirX = 1;
        if (this.dirY > 1) this.dirY = 1;
        if (this.dirY < -1) this.dirY = -1;
        if (this.dirX < -1) this.dirX = -1;

        this.opacity = 1;
    }
}

const particles: SecondParticle[] = [];
function createSParticles() {
    const offset = {
        x: cloackWidth * Math.cos(sRad),
        y: cloackWidth * Math.sin(sRad),
    };
    const sCenter = {
        x: centerPoint.x + offset.x,
        y: centerPoint.y + offset.y,
    };

    if (particles.length > 250) {
        for (let i = 0; i < 4; i++) {
            particles.push(new SecondParticle(sCenter));
        }
        return;
    }
    for (let i = 0; i < 30; i++) {
        particles.push(new SecondParticle(sCenter));
    }
}

function updateSParticles() {
    repelAllParticles(msCenter.x, msCenter.y, 1, 120);
    if (isMouseDown) {
        [...mouseHistory, mouse].forEach((mousePos, i) => {
            attractAllParticles(mousePos.x, mousePos.y, 1 + i * 0.1, 60 + i * (50 / mouseHistoryLimit));
            if (i === 0) {
                attractAllParticles(mousePos.x, mousePos.y, 0.3, 130);
            }
        });
    }
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        if (particles[i]) particles[i].draw();
    }
}

function repelAllParticles(x: number, y: number, power: number, range: number) {
    for (let i = 0; i < particles.length; i++) {
        particles[i].repel(x, y, power, range);
    }
}

function attractAllParticles(x: number, y: number, power: number, range: number) {
    for (let i = 0; i < particles.length; i++) {
        particles[i].attract(x, y, power, range);
    }
}
function resetSParticlesIsAttracted() {
    for (let i = 0; i < particles.length; i++) {
        particles[i].isAttracted = false;
    }
}

let isMouseDown = false;
let mouse = {
    x: 0,
    y: 0,
};
let mouseHistory: { x: number; y: number }[] = [];
const mouseHistoryLimit = 13;
let mouseHistoryInterval: ReturnType<typeof setInterval>;

function pushNewMousePoint() {
    mouseHistoryInterval = setInterval(() => {
        if (mouseHistory.some((pos) => Math.abs(pos.x - mouse.x) < 40 && Math.abs(pos.y - mouse.y) < 40)) {
            return;
        }
        if (mouseHistory.length >= mouseHistoryLimit) {
            mouseHistory.shift();
        }
        mouseHistory.push({ ...mouse });
    }, 30);
}
canvas.onmouseup = () => {
    resetSParticlesIsAttracted();
    isMouseDown = false;
    repelAllParticles(mouse.x, mouse.y, 10, 250);
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

setDimentions();
