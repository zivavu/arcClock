export let hours: number, minutes: number, seconds: number, milliseconds: number;
export let prevS: number;
export function updateDate() {
    const date = new Date();
    hours = date.getHours();
    minutes = date.getMinutes();
    prevS = seconds;
    seconds = date.getSeconds();
    milliseconds = date.getMilliseconds();
    updateRadians();
}

export let hRad: number, mRad: number, sRad: number, msRad: number;
function updateRadians() {
    msRad = (milliseconds * 2 * Math.PI) / 1000 - 0.5 * Math.PI;
    sRad = (seconds * 2 * Math.PI) / 60 - 0.5 * Math.PI;
}
