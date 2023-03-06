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
    drawCircle();
    updateMS();
    drawMS();
    if (seconds !== prevS) {
        createSParticles();
    }
    updateSParticles();
}

function drawCircle() {
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 5;
    ctx.arc(centerPoint.x, centerPoint.y, cloackWidth, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.closePath();
}

const msMainOffset = 30;
function updateMS() {
    const offset = {
        x: cloackWidth * Math.cos(msRad),
        y: cloackWidth * Math.sin(msRad),
    };
    const msCenter = {
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
    constructor(spawnPoint: { x: number; y: number }) {
        this.x = spawnPoint.x;
        this.y = spawnPoint.y;
        this.dirX = -Math.cos(sRad) + Math.random() * 0.3 - 0.15;
        this.dirY = -Math.sin(sRad) + Math.random() * 0.3 - 0.15;
        this.velocity = Math.random() * 10;
        this.size = Math.random() * 10 + 2;
        this.opacity = 1;
    }

    update() {
        this.x += this.dirX * this.velocity;
        this.y += this.dirY * this.velocity;
        this.opacity -= 0.007;
        this.size -= 0.01;
        this.velocity *= 1.006;

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
        ctx.stroke();
    }

    repel(x: number, y: number) {
        if (Math.abs(x - this.x) < 50 && Math.abs(y - this.y) < 50) {
            const forceX = (x - this.x) / 100 / (this.size / 2);
            const forceY = (y - this.y) / 100 / (this.size / 2);
            this.dirX -= forceX;
            this.dirY -= forceY;
        }
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
    for (let i = 0; i < 50; i++) {
        particles.push(new SecondParticle(sCenter));
    }
}

function updateSParticles() {
    if (isMouseDown) applyForceToParticles(mouse.x, mouse.y);
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        if (particles[i]) particles[i].draw();
    }
}

function applyForceToParticles(x: number, y: number) {
    for (let i = 0; i < particles.length; i++) {
        particles[i].repel(x, y);
    }
}

let isMouseDown = false;
let mouse = {
    x: 0,
    y: 0,
};
canvas.onmouseup = () => {
    isMouseDown = false;
};
canvas.onmousedown = () => {
    isMouseDown = true;
};
canvas.onmousemove = (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
};

setDimentions();
