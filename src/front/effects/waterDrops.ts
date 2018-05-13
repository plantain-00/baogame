export type WaterDrops = {
  life: number;
  drops: { x: number; y: number; vx: number; vy: number }[];
  x: number;
  y: number;
  height: number;
}

export function create(x: number, y: number, vy: number, height: number) {
  const result: WaterDrops = {
    life: 100,
    drops: [],
    x,
    y,
    height
  }
  for (let i = 0; i < 1 - vy * 2; i++) {
    result.drops.push({
      x: 0, y: 0, vx: Math.random() * 4 - 2, vy: -Math.random() * vy / 1.5 + 1
    })
  }
  return result
}

export function draw(ctx: CanvasRenderingContext2D, waterDrop: WaterDrops) {
  ctx.save()
  ctx.fillStyle = '#95a'
  for (const drop of waterDrop.drops) {
    if (drop.y >= 0) {
      drop.y += drop.vy
      drop.vy -= .2
      drop.x += drop.vx
      ctx.beginPath()
      ctx.arc(drop.x + waterDrop.x, waterDrop.height - drop.y - waterDrop.y, 6, 0, Math.PI * 2)
      ctx.fill()
    }
  }
  ctx.restore()
}
