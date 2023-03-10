export function normFloat(float: number, decimal: number = 1): number {
    const precision = decimal <= 0 ? 1 : Math.pow(10, decimal);
    return Math.round(float * precision) / precision;
}
