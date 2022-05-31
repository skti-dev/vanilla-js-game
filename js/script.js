const gameboard = document.querySelector("[data-value='gameboard']")
const char = document.querySelector("[data-value='char']")
const obstacle = document.querySelector("[data-value='obstacle']")
const scenery = document.querySelector("[data-value='scenery']")

const charAnimationDuration = window.getComputedStyle(document.documentElement).getPropertyValue("--char-animation-duration") ? window.getComputedStyle(document.documentElement).getPropertyValue("--char-animation-duration") : 500
const charWidth = window.getComputedStyle(document.documentElement).getPropertyValue("--char-width") ? +window.getComputedStyle(document.documentElement).getPropertyValue("--char-width").replace("px", "") : 120

const obstacleWidth = window.getComputedStyle(document.documentElement).getPropertyValue("--obstacle-width") ? +window.getComputedStyle(document.documentElement).getPropertyValue("--obstacle-width").replace("px", "") : 80

const charDeadWidth = window.getComputedStyle(document.documentElement).getPropertyValue("--char-dead-width") ? window.getComputedStyle(document.documentElement).getPropertyValue("--char-dead-width") : "65px"
const charDeadMarginLeft = window.getComputedStyle(document.documentElement).getPropertyValue("--char-dead-margin-left") ? window.getComputedStyle(document.documentElement).getPropertyValue("--char-dead-margin-left") : "55px"
const charDeadSrc = "./images/game-over.webp"

const handleJump = () => {
  try {
    char.classList.add("char-jump")
    setTimeout(() => {
      char.classList.remove("char-jump")
    }, charAnimationDuration)
  }catch(e) {
    console.error("Erro ao tentar pular: ", e)
  }
}

const handleKeydown = event => {
  if(!char) return window.location.reload()
  const { keyCode } = event
  const validKeyCodes = [37, 38, 39, 40, 32]
  if (!validKeyCodes.includes(keyCode)) return false
  handleJump()
}

const handleMousedown = () => {
  if(!char) return window.location.reload()
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

    if(obstaclePosition <= charWidth && obstaclePosition > 0 && charPosition < obstacleWidth) {
      obstacle.style.animation = "none"
      obstacle.style.left = `${obstaclePosition}px`
      
      char.style.animation = "none"
      char.src = charDeadSrc
      char.style.bottom = `${charPosition}px`
      char.style.width = charDeadWidth
      char.style.marginLeft = charDeadMarginLeft

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
