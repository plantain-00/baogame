export interface Toast {
  dy: number;
  life: number;
  t: number;
  x: number;
  y: number;
  size: number;
  txt: string;
  height: number;
}

export function create(x: number, y: number, size: number, txt: string, height: number) {
  return {
    dy: -60,
    life: 40,
    t: 0,
    x,
    y,
    size,
    txt,
    height
  }
}

export function draw(ctx: CanvasRenderingContext2D, toast: Toast) {
  toast.t++
  ctx.save()
  if (toast.life < 10) {
    toast.dy -= (10 - toast.life) / 4
    ctx.globalAlpha = toast.life / 10
  }
  ctx.translate(toast.x, toast.height - toast.y)
  ctx.scale(Math.min(toast.t / 5, 1), Math.min(toast.t / 5, 1))
  ctx.fillStyle = '#fff'
  ctx.font = toast.size + 'px 宋体'
  ctx.fillText(toast.txt, 0, toast.dy)
  ctx.font = '14px 宋体'
  ctx.restore()
}
