import { canvas, ctx } from '../../canvas.js';
import { secRad, seconds } from '../../timeManager.js';
import { normFloat } from '../../utils.js';
import { particles } from './particleManager.js';

export class SecondParticle {
    x: number;
    y: number;
    dirX: number;
    dirY: number;
    velocity: number;
    size: number;
    opacity: number;
    spawnProtection: number;
    isAttracted: boolean;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.dirX = -Math.cos(secRad) + Math.random() * 0.3 - 0.15;
        this.dirY = -Math.sin(secRad) + Math.random() * 0.3 - 0.15;
        this.velocity = Math.random() * 5;
        this.size = Math.random() * 10 + 2;
        this.opacity = 1;
        const extendSpawnProtection = (seconds >= 45 && seconds <= 60) || (seconds >= 0 && seconds <= 10);
        this.spawnProtection = extendSpawnProtection ? 90 : 50;
        this.isAttracted = false;
    }

    update() {
        if (this.dirX > 1) this.dirX = 1;
        if (this.dirX < -1) this.dirX = -1;
        if (this.dirY > 1) this.dirY = 1;
        if (this.dirY < -1) this.dirY = -1;

        this.x += this.dirX * this.velocity;
        this.y += this.dirY * this.velocity;
        this.opacity -= 0.003;
        this.size += 0.03;
        this.spawnProtection--;
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
        ctx.lineWidth = 2;
        ctx.strokeStyle = `rgba(255, 255, 255, ${this.opacity}`;
        ctx.beginPath();
        ctx.arc(normFloat(this.x), normFloat(this.y), normFloat(this.size), 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }

    repel(x: number, y: number, power: number, range: number, ignoreProtection: boolean = false) {
        if (Math.abs(x - this.x) > range || Math.abs(y - this.y) > range) return;
        if (!ignoreProtection && this.spawnProtection > 0 && !this.isAttracted) power *= 0.1;

        const forceX = (x - this.x) / 300 / Math.min(this.size / 5, 6);
        const forceY = (y - this.y) / 300 / Math.min(this.size / 5, 6);
        this.dirX -= forceX * power;
        this.dirY -= forceY * power;
        if (!this.isAttracted) this.velocity += (Math.abs(forceX) + Math.abs(forceY)) * (power * 5);
    }
    attract(x: number, y: number, power: number, range: number) {
        if (Math.abs(x - this.x) > range || Math.abs(y - this.y) > range) {
            return;
        }
        this.isAttracted = true;

        const forceX = (x - this.x) / 300 / Math.min(this.size / 8, 4);
        const forceY = (y - this.y) / 300 / Math.min(this.size / 8, 4);

        this.dirX += forceX * power;
        this.dirY += forceY * power;

        this.opacity = 1;
    }
}
