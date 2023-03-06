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
var msMainOffset = 30;
function updateMS() {
    var offset = {
        x: cloackWidth * Math.cos(msRad),
        y: cloackWidth * Math.sin(msRad),
    };
    var msCenter = {
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
        this.velocity = Math.random() * 10;
        this.size = Math.random() * 10 + 2;
        this.opacity = 1;
    }
    SecondParticle.prototype.update = function () {
        this.x += this.dirX * this.velocity;
        this.y += this.dirY * this.velocity;
        this.opacity -= 0.007;
        this.size -= 0.01;
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
        ctx.stroke();
    };
    SecondParticle.prototype.repel = function (x, y) {
        if (Math.abs(x - this.x) < 50 && Math.abs(y - this.y) < 50) {
            var forceX = (x - this.x) / 100 / (this.size / 2);
            var forceY = (y - this.y) / 100 / (this.size / 2);
            this.dirX -= forceX;
            this.dirY -= forceY;
        }
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
    for (var i = 0; i < 50; i++) {
        particles.push(new SecondParticle(sCenter));
    }
}
function updateSParticles() {
    if (isMouseDown)
        applyForceToParticles(mouse.x, mouse.y);
    for (var i = 0; i < particles.length; i++) {
        particles[i].update();
        if (particles[i])
            particles[i].draw();
    }
}
function applyForceToParticles(x, y) {
    for (var i = 0; i < particles.length; i++) {
        particles[i].repel(x, y);
    }
}
var isMouseDown = false;
var mouse = {
    x: 0,
    y: 0,
};
canvas.onmouseup = function () {
    isMouseDown = false;
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