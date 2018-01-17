export type Brust = {
  life: number;
  drops: { x: number; y: number }[];
  vy: number;
  x: number;
  y: number;
  height: number;
  size: number;
}

export function create (x: number, y: number, count: number, w: number, height: number, dx = 0, dy = 0, size = 6) {
  const drops: { x: number; y: number }[] = []
  for (let i = 0; i < count; i++) {
    drops.push({
      x: Math.random() * w - w / 2 + dx,
      y: Math.random() * 10 - 5 + dy
    })
  }
  return {
    life: 100,
    drops,
    vy: 2,
    x,
    y,
    height,
    size
  }
}

export function draw (ctx: CanvasRenderingContext2D, brust: Brust) {
  ctx.save()
  ctx.fillStyle = '#fff'
  ctx.globalAlpha = brust.life / 100
  brust.vy *= .95
  for (const drop of brust.drops) {
    drop.y -= brust.vy
    ctx.beginPath()
    ctx.arc(drop.x + brust.x, brust.height - drop.y - brust.y, brust.size, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.restore()
}
