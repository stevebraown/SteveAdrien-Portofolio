const canvas = document.getElementById('game')
const ctx = canvas.getContext('2d')

const state = {
  running: false,
  isTurning: false,
  score: 0,
  bestScore: Number(localStorage.getItem('driftLaneBest') || 0),
  lastTimestamp: 0,
  shake: 0,
  particles: [],
}

const player = {
  x: canvas.width / 2,
  y: canvas.height * 0.75,
  angle: 0,
  speed: 140,
  turnSpeed: 2.4,
  radius: 14,
}

const track = {
  centerX: canvas.width / 2,
  width: 190,
  amplitude: 40,
  frequency: 0.6,
  time: 0,
}

function resetGame() {
  state.running = true
  state.score = 0
  state.lastTimestamp = 0
  state.shake = 0
  state.particles = []
  player.x = canvas.width / 2
  player.y = canvas.height * 0.75
  player.angle = 0
  player.speed = 140
  track.time = 0
  track.amplitude = 40
  track.frequency = 0.6
}

function handlePress() {
  if (!state.running) {
    resetGame()
  }
  state.isTurning = true
}

function handleRelease() {
  state.isTurning = false
}

function handleKeyDown(event) {
  if (event.code === 'Space' || event.code === 'ArrowUp') {
    event.preventDefault()
    handlePress()
  }
}

function handleKeyUp(event) {
  if (event.code === 'Space' || event.code === 'ArrowUp') {
    event.preventDefault()
    handleRelease()
  }
}

canvas.addEventListener('mousedown', handlePress)
canvas.addEventListener('mouseup', handleRelease)
canvas.addEventListener('touchstart', (event) => {
  event.preventDefault()
  handlePress()
})
canvas.addEventListener('touchend', (event) => {
  event.preventDefault()
  handleRelease()
})
window.addEventListener('keydown', handleKeyDown)
window.addEventListener('keyup', handleKeyUp)

function update(dt) {
  track.time += dt
  player.speed += dt * 6
  track.amplitude += dt * 3.5
  track.frequency += dt * 0.02
  track.centerX =
    canvas.width / 2 + Math.sin(track.time * track.frequency) * track.amplitude

  if (state.isTurning) {
    player.angle += player.turnSpeed * dt
  } else {
    player.angle *= Math.pow(0.2, dt * 8)
  }

  const steering = Math.sin(player.angle) * player.speed * dt * 0.45
  player.x += steering

  const offset = Math.abs(player.x - track.centerX)
  const edgeDistance = track.width / 2 - offset

  if (edgeDistance < 24) {
    state.shake = Math.max(state.shake, (24 - edgeDistance) / 24)
  } else {
    state.shake *= 0.9
  }

  if (offset > track.width / 2) {
    state.running = false
    state.bestScore = Math.max(state.bestScore, Math.floor(state.score))
    localStorage.setItem('driftLaneBest', String(state.bestScore))
  } else {
    state.score += player.speed * dt * 0.2
  }

  if (state.isTurning) {
    spawnParticle()
  }

  state.particles = state.particles.filter((particle) => {
    particle.life -= dt
    particle.y += player.speed * dt * 0.2
    return particle.life > 0
  })
}

function spawnParticle() {
  state.particles.push({
    x: player.x + (Math.random() - 0.5) * 10,
    y: player.y + 20,
    radius: 2 + Math.random() * 3,
    life: 0.4 + Math.random() * 0.2,
  })
}

function drawLane() {
  const left = track.centerX - track.width / 2
  ctx.fillStyle = '#141a34'
  ctx.fillRect(left, 0, track.width, canvas.height)

  ctx.strokeStyle = '#7df9ff'
  ctx.lineWidth = 3
  ctx.shadowColor = '#7df9ff'
  ctx.shadowBlur = 12
  ctx.beginPath()
  ctx.moveTo(left, 0)
  ctx.lineTo(left, canvas.height)
  ctx.moveTo(left + track.width, 0)
  ctx.lineTo(left + track.width, canvas.height)
  ctx.stroke()
  ctx.shadowBlur = 0
}

function drawPlayer() {
  ctx.save()
  ctx.translate(player.x, player.y)
  ctx.rotate(player.angle)
  ctx.fillStyle = '#ff7ad9'
  ctx.beginPath()
  ctx.moveTo(0, -player.radius * 1.2)
  ctx.lineTo(-player.radius, player.radius)
  ctx.lineTo(player.radius, player.radius)
  ctx.closePath()
  ctx.fill()
  ctx.restore()
}

function drawParticles() {
  ctx.fillStyle = '#ffd36f'
  state.particles.forEach((particle) => {
    ctx.globalAlpha = Math.max(particle.life * 2, 0)
    ctx.beginPath()
    ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
    ctx.fill()
  })
  ctx.globalAlpha = 1
}

function drawHud() {
  ctx.fillStyle = '#e8f2ff'
  ctx.font = '16px Space Grotesk, sans-serif'
  ctx.fillText(`Score: ${Math.floor(state.score)}`, 20, 28)
  ctx.fillText(`Best: ${state.bestScore}`, 20, 48)
}

function drawOverlay() {
  if (state.running) return

  ctx.fillStyle = 'rgba(5, 6, 12, 0.7)'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = '#7df9ff'
  ctx.font = '28px Space Grotesk, sans-serif'
  ctx.fillText('Tap / Click / Press Space', 70, canvas.height / 2 - 10)
  ctx.fillStyle = '#ffd36f'
  ctx.font = '18px Space Grotesk, sans-serif'
  ctx.fillText('to start drifting', 160, canvas.height / 2 + 20)
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  if (state.shake > 0) {
    ctx.save()
    ctx.translate((Math.random() - 0.5) * 6 * state.shake, (Math.random() - 0.5) * 6 * state.shake)
  }
  drawLane()
  drawParticles()
  drawPlayer()
  if (state.shake > 0) {
    ctx.restore()
  }
  drawHud()
  drawOverlay()
}

function loop(timestamp) {
  if (!state.lastTimestamp) {
    state.lastTimestamp = timestamp
  }
  const dt = Math.min(0.05, (timestamp - state.lastTimestamp) / 1000)
  state.lastTimestamp = timestamp

  if (state.running) {
    update(dt)
  }
  render()
  requestAnimationFrame(loop)
}

render()
requestAnimationFrame(loop)
