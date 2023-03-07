var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
window.addEventListener('resize', setDimentions);
var centerPoint;
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
var msArcsLimit = 30;
var msLinesLimit = 10;
var cloackWidth = canvas.height / 2.5;
var hours, minutes, seconds, milliseconds;
var prevS;
function updateDate() {
    var date = new Date();
    hours = date.getHours();
    minutes = date.getMinutes();
    prevS = seconds;
    seconds = date.getSeconds();
    milliseconds = date.getMilliseconds();
    updateRadians();
}
var hRad, mRad, sRad, msRad;
function updateRadians() {
    msRad = (milliseconds * 2 * Math.PI) / 1000 - 0.5 * Math.PI;
    sRad = (seconds * 2 * Math.PI) / 60 - 0.5 * Math.PI;
}
var arcs = [];
var framerate = 1000 / 60;
var secInterval = setInterval(update, framerate);
function update() {
    updateDate();
    draw();
}
function draw() {
    if (document.hidden)
        return;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawClock();
    updateMS();
    drawMS();
    if (seconds !== prevS) {
        createSParticles();
    }
    updateSParticles();
}
function drawClock() {
    ctx.beginPath();
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 7;
    ctx.arc(centerPoint.x, centerPoint.y, cloackWidth, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.closePath();
    for (var i = 0; i < 60; i++) {
        var rad = (i * 2 * Math.PI) / 60 - 0.5 * Math.PI;
        var offset = {
            x: cloackWidth * Math.cos(rad),
            y: cloackWidth * Math.sin(rad),
        };
        var start = {
            x: centerPoint.x + offset.x,
            y: centerPoint.y + offset.y,
        };
        var dir = {
            x: -Math.cos(rad),
            y: -Math.sin(rad),
        };
        var markLength = void 0;
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
var msMainOffset = 30;
var msCenter;
function updateMS() {
    var offset = {
        x: cloackWidth * Math.cos(msRad),
        y: cloackWidth * Math.sin(msRad),
    };
    msCenter = {
        x: centerPoint.x + offset.x,
        y: centerPoint.y + offset.y,
    };
    arcs.push([]);
    var currentRoot = arcs[arcs.length - 1];
    for (var i = 0; i < 6; i++) {
        currentRoot.push([{ x: msCenter.x, y: msCenter.y }]);
        var currentBranch = currentRoot[i];
        for (var j = 0; j < msLinesLimit; j++) {
            var _a = currentBranch[j], prevX = _a.x, prevY = _a.y;
            var newX = prevX + (Math.random() * msMainOffset - msMainOffset / 2);
            var newY = prevY + (Math.random() * msMainOffset - msMainOffset / 2);
            currentBranch.push({ x: newX, y: newY });
        }
    }
    if (arcs.length > msArcsLimit) {
        arcs.shift();
    }
}
function drawMS() {
    for (var i = 0; i < arcs.length; i++) {
        var currentRoot = arcs[i];
        var opacity = ((i / msArcsLimit) * 0.4).toFixed(2);
        ctx.strokeStyle = "rgba(255, 255, 255, ".concat(opacity, ")");
        for (var j = 0; j < currentRoot.length; j++) {
            var currentBranch = currentRoot[j];
            for (var k = 0; k < currentBranch.length - 1; k++) {
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
var SecondParticle = /** @class */ (function () {
    function SecondParticle(spawnPoint) {
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
    SecondParticle.prototype.update = function () {
        this.x += this.dirX * this.velocity;
        this.y += this.dirY * this.velocity;
        this.opacity -= 0.003;
        this.size += 0.03;
        this.lifeTime++;
        if (!this.isAttracted)
            this.velocity *= 1.006;
        if (this.x + this.size < 0 ||
            this.x - this.size > canvas.width ||
            this.y + this.size < 0 ||
            this.y - this.size > canvas.height) {
            particles.splice(particles.indexOf(this), 1);
        }
        if (this.opacity <= 0) {
            particles.splice(particles.indexOf(this), 1);
        }
    };
    SecondParticle.prototype.draw = function () {
        ctx.strokeStyle = "rgba(255, 255, 255, ".concat(this.opacity);
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.lineWidth = 3;
        ctx.fill();
        ctx.stroke();
    };
    SecondParticle.prototype.repel = function (x, y, power, range) {
        if (Math.abs(x - this.x) > range || Math.abs(y - this.y) > range)
            return;
        if (this.lifeTime < 40)
            power *= 0.1;
        var forceX = (x - this.x) / 100 / (this.size / 3);
        var forceY = (y - this.y) / 100 / (this.size / 3);
        this.dirX -= forceX * power;
        this.dirY -= forceY * power;
        this.velocity += (Math.abs(forceX) + Math.abs(forceY)) * (power * 5);
    };
    SecondParticle.prototype.attract = function (x, y, power, range) {
        if (Math.abs(x - this.x) > range || Math.abs(y - this.y) > range) {
            this.isAttracted = false;
            return;
        }
        this.isAttracted = true;
        var forceX = (x - this.x) / 50 / this.size;
        var forceY = (y - this.y) / 50 / this.size;
        this.dirX += forceX * power;
        this.dirY += forceY * power;
        if (this.dirX > 1)
            this.dirX = 1;
        if (this.dirY > 1)
            this.dirY = 1;
        if (this.dirY < -1)
            this.dirY = -1;
        if (this.dirX < -1)
            this.dirX = -1;
        this.opacity = 1;
    };
    return SecondParticle;
}());
var particles = [];
function createSParticles() {
    var offset = {
        x: cloackWidth * Math.cos(sRad),
        y: cloackWidth * Math.sin(sRad),
    };
    var sCenter = {
        x: centerPoint.x + offset.x,
        y: centerPoint.y + offset.y,
    };
    for (var i = 0; i < 30; i++) {
        particles.push(new SecondParticle(sCenter));
    }
}
function updateSParticles() {
    repelAllParticles(msCenter.x, msCenter.y, 1, 120);
    if (isMouseDown)
        attractAllParticles(mouse.x, mouse.y, 1.5, 170);
    for (var i = 0; i < particles.length; i++) {
        particles[i].update();
        if (particles[i])
            particles[i].draw();
    }
}
function repelAllParticles(x, y, power, range) {
    for (var i = 0; i < particles.length; i++) {
        particles[i].repel(x, y, power, range);
    }
}
function attractAllParticles(x, y, power, range) {
    for (var i = 0; i < particles.length; i++) {
        particles[i].attract(x, y, power, range);
    }
}
var isMouseDown = false;
var mouse = {
    x: 0,
    y: 0,
};
canvas.onmouseup = function () {
    isMouseDown = false;
    repelAllParticles(mouse.x, mouse.y, 10, 250);
    console.log('mouse up');
};
canvas.onmousedown = function () {
    isMouseDown = true;
};
canvas.onmousemove = function (e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
};
setDimentions();
//# sourceMappingURL=canvas.js.map