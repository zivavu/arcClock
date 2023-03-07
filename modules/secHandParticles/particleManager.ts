import { centerScreenPoint, cloackWidth, mouseHistoryLimit } from '../canvas/canvas.js';
import { isMouseDown, mouse, mouseHistory } from '../mouseManager/mouseManager.js';
import { msCenter } from '../msHand/msHand.js';
import { secRad } from '../timeManager/timeManager.js';
import { SecondParticle } from './SecondParticle.js';

export const particles: SecondParticle[] = [];
export function createSParticles() {
    const offset = {
        x: cloackWidth * Math.cos(secRad),
        y: cloackWidth * Math.sin(secRad),
    };
    const sCenter = {
        x: centerScreenPoint.x + offset.x,
        y: centerScreenPoint.y + offset.y,
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

export function updateSParticles() {
    repelAllParticles(msCenter.x, msCenter.y, 1, 120);
    if (isMouseDown) {
        [...mouseHistory, mouse].forEach((mousePos, i) => {
            attractAllParticles(mousePos.x, mousePos.y, 0.6 + i * 0.3, 50 + i * (70 / mouseHistoryLimit));
            if (i === 0) {
                attractAllParticles(mousePos.x, mousePos.y, 0.3, 140);
            }
        });
    }
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        if (particles[i]) particles[i].draw();
    }
}

export function repelAllParticles(x: number, y: number, power: number, range: number) {
    for (let i = 0; i < particles.length; i++) {
        particles[i].repel(x, y, power, range);
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
