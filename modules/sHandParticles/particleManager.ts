import { centerScreenPoint, cloackWidth } from '../canvas/canvas.js';
import { isMouseDown, mouse, mouseHistory, mouseHistoryLimit } from '../mouseManager/mouseManager.js';
import { msCenter } from '../msHand/msHand.js';
import { sRad } from '../timeManager/timeManager.js';
import { SecondParticle } from './SecondParticle.js';

export const particles: SecondParticle[] = [];
export function createSParticles() {
    const offset = {
        x: cloackWidth * Math.cos(sRad),
        y: cloackWidth * Math.sin(sRad),
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
            attractAllParticles(mousePos.x, mousePos.y, 1 + i * 0.1, 60 + i * (50 / mouseHistoryLimit));
            if (i === 0) {
                attractAllParticles(mousePos.x, mousePos.y, 0.4, 140);
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
