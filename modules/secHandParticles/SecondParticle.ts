import { canvas, ctx } from '../canvas/canvas.js';
import { secRad } from '../timeManager/timeManager.js';
import { particles } from './particleManager.js';

export class SecondParticle {
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
        this.dirX = -Math.cos(secRad) + Math.random() * 0.3 - 0.15;
        this.dirY = -Math.sin(secRad) + Math.random() * 0.3 - 0.15;
        this.velocity = Math.random() * 7;
        this.size = Math.random() * 10 + 2;
        this.opacity = 1;
        this.lifeTime = 0;
        this.isAttracted = false;
    }

    update() {
        this.x += this.dirX * this.velocity;
        this.y += this.dirY * this.velocity;
        this.opacity -= 0.002;
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
        if (this.lifeTime < 60 && !this.isAttracted) power *= 0.1;

        const forceX = (x - this.x) / 100 / Math.min(this.size / 5, 6);
        const forceY = (y - this.y) / 100 / Math.min(this.size / 5, 6);
        this.dirX -= forceX * power;
        this.dirY -= forceY * power;
        if (!this.isAttracted) this.velocity += (Math.abs(forceX) + Math.abs(forceY)) * (power * 5);
    }
    attract(x: number, y: number, power: number, range: number) {
        if (Math.abs(x - this.x) > range || Math.abs(y - this.y) > range) {
            return;
        }
        this.isAttracted = true;

        const forceX = (x - this.x) / 80 / Math.min(this.size / 8, 4);
        const forceY = (y - this.y) / 80 / Math.min(this.size / 8, 4);

        this.dirX += forceX * power;
        this.dirY += forceY * power;
        if (this.dirX > 1) this.dirX = 1;
        if (this.dirY > 1) this.dirY = 1;
        if (this.dirY < -1) this.dirY = -1;
        if (this.dirX < -1) this.dirX = -1;

        this.opacity = 1;
    }
}
