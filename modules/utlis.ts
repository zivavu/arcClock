export function normFloat(float: number, decimal: number = 1): number {
    return parseFloat(float.toFixed(decimal));
}
