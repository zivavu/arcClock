var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
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
    // drawMouseHistory();
}
function drawMouseHistory() {
    mouseHistory.forEach(function (point) {
        ctx.beginPath();
        ctx.fillStyle = "yellow";
        ctx.fillRect(point.x, point.y, 20, 20);
        ctx.closePath();
        ctx.fillStyle = "black";
    });
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
        if (this.lifeTime < 60)
            power *= 0.1;
        var forceX = (x - this.x) / 100 / (this.size / 3);
        var forceY = (y - this.y) / 100 / (this.size / 3);
        this.dirX -= forceX * power;
        this.dirY -= forceY * power;
        if (!this.isAttracted)
            this.velocity += (Math.abs(forceX) + Math.abs(forceY)) * (power * 5);
    };
    SecondParticle.prototype.attract = function (x, y, power, range) {
        if (Math.abs(x - this.x) > range || Math.abs(y - this.y) > range) {
            return;
        }
        this.isAttracted = true;
        var forceX = (x - this.x) / 100 / (this.size / 5);
        var forceY = (y - this.y) / 100 / (this.size / 5);
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
    if (particles.length > 250) {
        for (var i = 0; i < 4; i++) {
            particles.push(new SecondParticle(sCenter));
        }
        return;
    }
    for (var i = 0; i < 30; i++) {
        particles.push(new SecondParticle(sCenter));
    }
}
function updateSParticles() {
    repelAllParticles(msCenter.x, msCenter.y, 1, 120);
    if (isMouseDown) {
        __spreadArray(__spreadArray([], mouseHistory, true), [mouse], false).forEach(function (mousePos, i) {
            attractAllParticles(mousePos.x, mousePos.y, 1 + i * 0.1, 60 + i * (50 / mouseHistoryLimit));
            if (i === 0) {
                attractAllParticles(mousePos.x, mousePos.y, 0.3, 130);
            }
        });
    }
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
function resetSParticlesIsAttracted() {
    for (var i = 0; i < particles.length; i++) {
        particles[i].isAttracted = false;
    }
}
var isMouseDown = false;
var mouse = {
    x: 0,
    y: 0,
};
var mouseHistory = [];
var mouseHistoryLimit = 13;
var mouseHistoryInterval;
function pushNewMousePoint() {
    mouseHistoryInterval = setInterval(function () {
        if (mouseHistory.some(function (pos) { return Math.abs(pos.x - mouse.x) < 40 && Math.abs(pos.y - mouse.y) < 40; })) {
            return;
        }
        if (mouseHistory.length >= mouseHistoryLimit) {
            mouseHistory.shift();
        }
        mouseHistory.push(__assign({}, mouse));
    }, 30);
}
canvas.onmouseup = function () {
    resetSParticlesIsAttracted();
    isMouseDown = false;
    repelAllParticles(mouse.x, mouse.y, 10, 250);
    mouseHistory = [];
    clearInterval(mouseHistoryInterval);
};
canvas.onmousedown = function () {
    isMouseDown = true;
    pushNewMousePoint();
};
canvas.onmousemove = function (e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
};
setDimentions();
//# sourceMappingURL=canvas.js.map