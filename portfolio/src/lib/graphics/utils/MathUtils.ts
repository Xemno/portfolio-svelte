export function lerp(a: number, b: number, t: number, eps: number = 1e-3) {
	const result = (1 - t) * a + t * b
	if (Math.abs(b - result) < eps)
		return b
	else
		return result
}

export function map(value: number, start1: number, stop1: number, start2: number, stop2: number): number {
	return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
}

export function clamp(value: number, min: number, max: number): number {
	return Math.min(Math.max(value, min), max);
}
