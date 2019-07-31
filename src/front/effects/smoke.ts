export interface Smoke {
  life: number;
  totalLife: number;
  chaos: number;
  x: number;
  y: number;
  size: number;
}

export function create(x: number, y: number, size: number, life: number): Smoke {
  return {
    life: Math.floor(life),
    totalLife: Math.random() * 60 + 30,
    chaos: Math.random() * 4 - 2,
    x,
    y,
    size
  }
}

export function draw(ctx: CanvasRenderingContext2D, t: number, smoke: Smoke) {
  t += smoke.chaos
  const g = t < 5 ? 255 - Math.floor(t * 50) : Math.min(255, Math.floor(t * 20))
  const b = t < 5 ? 0 : Math.min(255, Math.floor(t * 20))
  const a = (smoke.totalLife - smoke.life) / smoke.totalLife
  ctx.fillStyle = 'rgba(255, ' + g + ', ' + b + ', ' + a + ')'
  ctx.beginPath()
  ctx.arc(smoke.x, smoke.y, smoke.size, 0, Math.PI * 2)
  ctx.fill()
}
