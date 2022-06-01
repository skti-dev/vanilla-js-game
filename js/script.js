let hasError = false

const gameboard = document.querySelector("[data-value='gameboard']")
const char = document.querySelector("[data-value='char']")
const obstacle = document.querySelector("[data-value='obstacle']")
const scenery = document.querySelector("[data-value='scenery']")

if(!gameboard || !char || !obstacle || !scenery) hasError = true

const gamedata = {
  char: {
    duration: 500,
    width: 120
  },
  obstacle: {
    duration: 2000,
    width: 80
  },
  charDead: {
    width: "65px",
    marginLeft: "55px",
    source: "./images/game-over.webp"
  }
}

const initVars = () => {
  try {
    gamedata.char.duration = +window.getComputedStyle(document.documentElement).getPropertyValue("--char-animation-duration").replace("ms", "")
    gamedata.char.width = +window.getComputedStyle(document.documentElement).getPropertyValue("--char-width").replace("px", "")

    gamedata.obstacle.duration = +window.getComputedStyle(document.documentElement).getPropertyValue("--obstacle-animation-duration").replace("ms", "")
    gamedata.obstacle.width = +window.getComputedStyle(document.documentElement).getPropertyValue("--obstacle-width").replace("px", "")

    gamedata.charDead.width = window.getComputedStyle(document.documentElement).getPropertyValue("--char-dead-width").trim("")
    gamedata.charDead.marginLeft = window.getComputedStyle(document.documentElement).getPropertyValue("--char-dead-margin-left").trim("")
  }catch(e) {
    hasError = true
    console.error("Erro ao inicializar variáveis: ", e)
  }
}
initVars()

const handleJump = () => {
  try {
    if(hasError) return window.location.reload()
    char.classList.add("char-jump")
    setTimeout(() => {
      console.log("removeu")
      char.classList.remove("char-jump")
    }, gamedata.char.duration)
  }catch(e) {
    console.error("Erro ao tentar pular: ", e)
  }
}

const handleKeydown = event => {
  if(hasError) return window.location.reload()
  const { keyCode } = event
  const validKeyCodes = [37, 38, 39, 40, 32]
  if (!validKeyCodes.includes(keyCode)) return false
  handleJump()
}

const handleMousedown = () => {
  if(hasError) return window.location.reload()
  handleJump()
}

window.addEventListener('keydown', handleKeydown)
gameboard.addEventListener('mousedown', handleMousedown)
gameboard.addEventListener('touchstart', handleMousedown)

const gameLoop = setInterval(() => {
  try {
    const obstaclePosition = obstacle.offsetLeft
    const charPosition = +window.getComputedStyle(char).getPropertyValue("bottom").replace("px", "")
    const sceneryPosition = scenery.offsetLeft

    if(obstaclePosition <= gamedata.char.width && obstaclePosition > 0 && charPosition < gamedata.obstacle.width) {
      obstacle.style.animation = "none"
      obstacle.style.left = `${obstaclePosition}px`
      
      char.style.animation = "none"
      char.src = gamedata.charDead.source
      char.style.bottom = `${charPosition}px`
      char.style.width = gamedata.charDead.width
      char.style.marginLeft = gamedata.charDead.marginLeft

      scenery.style.animation = "none"
      scenery.style.left = `${sceneryPosition}px`

      clearInterval(gameLoop)
      window.removeEventListener('keydown', handleKeydown)
      gameboard.removeEventListener('mousedown', handleMousedown)
      gameboard.removeEventListener('touchstart', handleMousedown)
    }
  }catch(e) {
    console.error("Erro ao tentar atualizar obstáculo: ", e)
    clearInterval(gameLoop)
  }
}, 10)
