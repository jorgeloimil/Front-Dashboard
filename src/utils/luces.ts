/** Color aproximado de una bombilla según su temperatura de color (2700 K cálido – 6500 K frío). */
export function colorDeTono(kelvin: number): string {
  const t = (kelvin - 2700) / (6500 - 2700);
  return `rgb(${Math.round(255 - t * 50)},${Math.round(170 + t * 70)},${Math.round(90 + t * 165)})`;
}
