var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
window.addEventListener('resize', setDimentions);
var cloackWidth = canvas.width;
function setDimentions() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    draw();
}
setDimentions();
var hours, minutes, seconds, milliseconds;
function updateDate() {
    var date = new Date();
    hours = date.getHours();
    minutes = date.getMinutes();
    seconds = date.getSeconds();
    milliseconds = date.getMilliseconds();
}
var framerate = 60 / 1000;
var currentFrame = 0;
var secInterval = setInterval(update, framerate);
function update() {
    updateDate();
    currentFrame++;
    if (currentFrame >= 60) {
        currentFrame = 0;
    }
}
function draw() {
    ctx.beginPath();
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 5;
    var centerWidth = canvas.width / 2;
    var centerHeight = canvas.height / 2;
    ctx.arc(centerWidth, centerHeight, cloackWidth, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.beginPath();
}
draw();
console.log(canvas.width, canvas.height);
//# sourceMappingURL=canvas.js.map