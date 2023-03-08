import { centerScreenPoint, cloackWidth, mouseHistoryLimit } from '../../canvas/canvas.js';
import { isMouseDown, mouse, mouseHistory } from '../../mouseManager/mouseManager.js';
import { secRad } from '../../timeManager/timeManager.js';
import { msCenter } from '../msHand/msHand.js';
import { SecondParticle } from './SecondParticle.js';

export const particles: SecondParticle[] = [];
export function createSParticles() {
    const offset = {
        x: cloackWidth * Math.cos(secRad),
        y: cloackWidth * Math.sin(secRad),
    };
    const secCenter = {
        x: centerScreenPoint.x + offset.x,
        y: centerScreenPoint.y + offset.y,
    };

    if (particles.length > 200) {
        for (let i = 0; i < 4; i++) {
            particles.push(new SecondParticle(secCenter.x, secCenter.y));
        }
        return;
    }
    for (let i = 0; i < 30; i++) {
        particles.push(new SecondParticle(secCenter.x, secCenter.y));
    }
}

export function updateSParticles() {
    if (isMouseDown) {
        [...mouseHistory, mouse].forEach((pos, i) => {
            attractAllParticles(pos.x, pos.y, 0.6 + i * 0.3, 60 + i * (60 / mouseHistoryLimit));
            if (i === 0) {
                attractAllParticles(pos.x, pos.y, 0.3, 140);
            }
        });
    }
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
    }
}
export function drawSParticles() {
    for (let i = 0; i < particles.length; i++) {
        if (particles[i]) particles[i].draw();
    }
}

export function repelAllParticles(
    x: number,
    y: number,
    power: number,
    range: number,
    ignoreProtection: boolean = false
) {
    for (let i = 0; i < particles.length; i++) {
        particles[i].repel(x, y, power, range, ignoreProtection);
    }
}

export function attractAllParticles(x: number, y: number, power: number, range: number) {
    for (let i = 0; i < particles.length; i++) {
        particles[i].attract(x, y, power, range);
    }
}
export function resetSParticlesIsAttracted() {
    for (let i = 0; i < particles.length; i++) {
        particles[i].isAttracted = false;
    }
}
