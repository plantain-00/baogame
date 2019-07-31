import * as common from '../back/common'
import * as images from './images'
import * as flare from './effects/flare'
import * as toast from './effects/toast'
import * as brust from './effects/brust'
import * as waterDrop from './effects/waterDrops'
import * as itemDead from './effects/itemDead'
import * as shotLine from './effects/shotLine'
import { locale } from './index'

const brusts: brust.Brust[] = []
export const flares: flare.Flare[] = []
export const itemDeads: itemDead.ItemDead[] = []
const shotLines: shotLine.ShotLine[] = []
export const toasts: toast.Toast[] = []
export const waterDrops: waterDrop.WaterDrops[] = []

export function draw(ctx: CanvasRenderingContext2D) {
  for (let i = brusts.length - 1; i >= 0; i--) {
    const eff = brusts[i]
    if (eff.life < 0) {
      brusts.splice(i, 1)
    } else {
      brust.draw(ctx, eff)
      eff.life--
    }
  }

  for (let i = flares.length - 1; i >= 0; i--) {
    const eff = flares[i]
    if (eff.life < 0) {
      flares.splice(i, 1)
    } else {
      flare.draw(ctx, eff)
      eff.life--
    }
  }

  for (let i = itemDeads.length - 1; i >= 0; i--) {
    const eff = itemDeads[i]
    if (eff.life < 0) {
      itemDeads.splice(i, 1)
    } else {
      itemDead.draw(ctx, eff)
      eff.life--
    }
  }

  for (let i = shotLines.length - 1; i >= 0; i--) {
    const eff = shotLines[i]
    if (eff.life < 0) {
      shotLines.splice(i, 1)
    } else {
      shotLine.draw(ctx, eff)
      eff.life--
    }
  }

  for (let i = toasts.length - 1; i >= 0; i--) {
    const eff = toasts[i]
    if (eff.life < 0) {
      toasts.splice(i, 1)
    } else {
      toast.draw(ctx, eff)
      eff.life--
    }
  }

  for (let i = waterDrops.length - 1; i >= 0; i--) {
    const eff = waterDrops[i]
    if (eff.life < 0) {
      waterDrops.splice(i, 1)
    } else {
      waterDrop.draw(ctx, eff)
      eff.life--
    }
  }
}

// 绘制背景
export function drawBg(ctx: CanvasRenderingContext2D, map: common.MapData, width: number, height: number) {
  ctx.clearRect(0, 0, width, height)
  // 绘制柱子
  if (map.ladders) {
    for (const ladder of map.ladders) {
      ctx.fillStyle = '#888'
      for (let j = height - ladder.y2 * common.tileHeight + 10; j < height - ladder.y1 * common.tileHeight; j += 20) {
        ctx.fillRect(ladder.x * common.tileWidth - 10, j, 20, 4)
      }

      ctx.fillStyle = '#aaa'
      ctx.beginPath()
      ctx.rect(ladder.x * common.tileHeight - 12, height - ladder.y2 * common.tileHeight, 4, (ladder.y2 - ladder.y1) * common.tileHeight)
      ctx.stroke()
      ctx.fill()
      ctx.beginPath()
      ctx.arc(ladder.x * common.tileWidth - 10, height - ladder.y2 * common.tileHeight - 4, 4, 0, 2 * Math.PI)
      ctx.stroke()
      ctx.fill()

      ctx.beginPath()
      ctx.rect(ladder.x * common.tileWidth + 8, height - ladder.y2 * common.tileHeight, 4, (ladder.y2 - ladder.y1) * common.tileHeight)
      ctx.stroke()
      ctx.fill()
      ctx.beginPath()
      ctx.arc(ladder.x * common.tileWidth + 10, height - ladder.y2 * common.tileHeight - 4, 4, 0, 2 * Math.PI)
      ctx.stroke()
      ctx.fill()
    }
  }

  // 绘制地板
  for (let i = 0; i < map.h; i++) {
    for (let j = 0; j < map.w; j++) {
      if (map.floors[i * map.w + j]) {
        const x = j * common.tileWidth
        const y = height - i * common.tileHeight
        ctx.beginPath()
        ctx.fillStyle = '#aa8'
        ctx.moveTo(x + 1, y)
        ctx.lineTo(x + common.tileWidth - 1, y)
        ctx.lineTo(x + common.tileWidth - 1, y + 4)
        ctx.lineTo(x + common.tileWidth - 5, y + 8)
        ctx.lineTo(x + 5, y + 8)
        ctx.lineTo(x + 1, y + 4)
        ctx.fill()

        ctx.fillStyle = '#982'
        ctx.beginPath()
        ctx.fillRect(x + 1, y, common.tileWidth - 2, 4)
        ctx.fill()
      }
    }
  }
}

export function drawDoors(ctx: CanvasRenderingContext2D, doors: common.Door[], height: number) {
  ctx.fillStyle = '#fff'
  ctx.font = '20px 宋体'
  for (const door of doors) {
    ctx.drawImage(images.door, door.x * common.tileWidth, height - (door.y + 1) * common.tileHeight, common.tileWidth, common.tileHeight)
  }
  ctx.font = '14px 宋体'
}

export function drawItemGates(ctx: CanvasRenderingContext2D, itemGates: common.ItemGate[], height: number) {
  ctx.fillStyle = '#fff'
  ctx.font = '20px 宋体'
  for (const itemGate of itemGates) {
    ctx.drawImage(images.itemGate, itemGate.x * common.tileWidth, height - (itemGate.y + 1) * common.tileHeight, common.tileWidth, common.tileHeight)
  }
  ctx.font = '14px 宋体'
}

export function drawWater(ctx: CanvasRenderingContext2D, waterHeight: number, color: string, height: number, width: number, t: number) {
  const waveLen = 20
  let waveHeight = waterHeight / 5
  const c = waveLen / 2
  const b = height - waterHeight
  const offset = Math.sin(t / 50 + waterHeight) * 10
  let start = offset - 10
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.moveTo(start, height)
  ctx.lineTo(start, height - waterHeight)
  while (start < width) {
    ctx.bezierCurveTo(start + c, b + waveHeight, start + waveLen - c, b + waveHeight, start + waveLen, b)
    start += waveLen
    waveHeight *= -1
  }
  ctx.lineTo(width, height)
  ctx.fill()
}

function drawWeapon(ctx: CanvasRenderingContext2D, index: number) {
  ctx.strokeStyle = '#fff'
  ctx.lineWidth = 6
  if (index < 10) {
    ctx.rotate(1 - index / 10)
  }
  ctx.beginPath()
  ctx.moveTo(10, 0)
  let endx
  if (index < 10) {
    ctx.lineTo(10 + index * 2, 10 - index)
    ctx.lineTo(10 + index * 3, -5)
    endx = 10 + index * 3
  } else {
    ctx.lineTo(10 + 20, 0)
    ctx.lineTo(10 + 30, -5)
    endx = 10 + 30
  }
  ctx.stroke()

  ctx.strokeStyle = '#F00'
  ctx.beginPath()
  ctx.moveTo(endx, 0)
  ctx.lineTo(endx, -6)
  ctx.lineTo(endx + 9, -6)
  ctx.stroke()

  ctx.lineWidth = 1
}

export function drawUser(ctx: CanvasRenderingContext2D, user: common.User, currentUserId: number | undefined | null, height: number, width: number, userWidth: number, userHeight: number) {
  if (user.doubleJumping) {
    brusts.push(brust.create(user.x, user.y, 10, 40, height))
  }

  ctx.save()
  let img
  ctx.translate(user.x, height - user.y)
  if (user.dead) {
    img = images.alone
  } else if (user.status === common.UserStatus.dieing) {
    img = images.alone
  } else if (user.itemType === common.ItemType.power) {
    img = images.win
  } else if (user.danger) {
    img = images.danger
  } else if (user.status === common.UserStatus.crawling
    || user.status === common.UserStatus.mining
    || user.status === common.UserStatus.rolling2) {
    img = images.throll
  } else if (user.itemType === common.ItemType.bomb) {
    img = images.wtf
  } else {
    img = user.status === common.UserStatus.falling
      || user.status === common.UserStatus.climbing
      ? images.happy
      : images.normal
  }

  ctx.fillStyle = user.id === currentUserId ? '#ffa' : '#f77'

  // 用户指示器
  if (user.itemType !== common.ItemType.hide || user.id === currentUserId) {
    ctx.fillText(user.name, 0, -50)
    if (user.nearLadder && user.id === currentUserId) {
      ctx.fillText(locale.ui.up, 0, -70)
    }
  }

  ctx.scale(user.faceing, 1)

  if (user.fireing) {
    if (user.fireing === 5) {
      shotLines.push(shotLine.create(user.x, user.y + 25, user.faceing, height, width))
    }
    ctx.save()
    ctx.translate(0, -userWidth / 2)
    drawWeapon(ctx, 25 - user.fireing)
    ctx.restore()
  }

  if (user.itemType === common.ItemType.hide) {
    ctx.globalAlpha = user.itemCount > 900 ? (user.itemCount - 900) / 100 : user.itemCount > 100 ? 0 : (100 - user.itemCount) / 100
  }

  if (user.status === common.UserStatus.crawling
    || user.status === common.UserStatus.mining
    || user.status === common.UserStatus.rolling2) {
    ctx.drawImage(img, -userWidth / 2, -25, userWidth, userHeight)
  } else {
    ctx.drawImage(img, -userWidth / 2, -userHeight, userWidth, userHeight)
  }
  if (user.itemType === common.ItemType.flypack) {
    const bottleWidth = 10
    const bottleHeight = 30
    const wPadding = -userWidth / 2 - bottleWidth
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.fillStyle = 'rgb(100,160,255)'
    ctx.fillRect(wPadding, -bottleHeight * user.itemCount / common.itemCounts[common.ItemType.flypack], bottleWidth, bottleHeight * user.itemCount / common.itemCounts[common.ItemType.flypack])
    ctx.stroke()

    ctx.drawImage(images.jet, wPadding - 16, -bottleHeight - 10, 40, bottleHeight + 20)
    if (user.flying) {
      brusts.push(brust.create(user.x, user.y, 1, 5, height, user.faceing * (wPadding + bottleWidth / 2), -10))
    }
  }
  if (user.itemType === common.ItemType.bomb) {
    ctx.drawImage(images.bomb, userWidth / 2 - 10, -userHeight, 30, 40)
    if (!user.dead) {
      ctx.scale(user.faceing, 1)
      const x = user.faceing * (userWidth / 2 + 10)
      ctx.font = '28px 宋体'
      ctx.fillStyle = '#ff0'
      ctx.fillText((Math.floor(user.itemCount * 17 / 1000) + 1).toString(), x, -userHeight - 10)
      ctx.font = '14px 宋体'
      ctx.scale(user.faceing, 1)
    }
  }
  if (user.grenadeing > 0) {
    ctx.save()

    ctx.translate(-10, -20)
    ctx.rotate((25 - user.grenadeing) / 10)
    ctx.translate(-40, -userHeight / 2)

    ctx.drawImage(images.arm, 0, 0, 40, 40)
    ctx.drawImage(images.grenade, -10, -13, 30, 40)
    ctx.restore()
  }
  ctx.restore()
}

export function drawItem(ctx: CanvasRenderingContext2D, item: common.Item, t: number, height: number) {
  const s = common.itemSize
  ctx.strokeStyle = 'rgba(255,255,255,' + Math.abs((t % 300) / 150 - 1) + ')'
  ctx.lineWidth = 3
  ctx.save()
  ctx.translate(item.x, height - item.y)
  ctx.beginPath()
  ctx.arc(0, 0, s, 0, 2 * Math.PI)
  ctx.stroke()
  ctx.fill()
  ctx.lineWidth = 1
  ctx.drawImage(images.items[item.type], -s, -s, s * 2, s * 2)
  ctx.restore()
}

export function drawGrenade(ctx: CanvasRenderingContext2D, grenade: common.Grenade, height: number) {
  const w = 15
  const h = 18
  ctx.save()
  ctx.translate(grenade.x, height - grenade.y)
  ctx.rotate(grenade.r / 10)
  ctx.drawImage(images.grenade, -w, -h, w * 2, h * 2)
  ctx.restore()
}
