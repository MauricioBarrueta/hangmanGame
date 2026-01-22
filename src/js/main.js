const word = document.querySelector('.word'), lettersNotAvailable = document.querySelector('.used-letters'),
  playGameBtn = document.getElementById('playButton'), canvasContainer = document.querySelector('.canvas-container'),
  totalAttempts = document.querySelector('.canvas-container span'), selectedWord = document.querySelector('.word-preview'), 
  totalLetters = document.getElementById('totalLetters')

window.onload = () => {
  canvasContainer.style.display = 'none', lettersNotAvailable.style.display = 'none', selectedWord.style.display = 'none'
  renderAttempts()
}

let canvas = document.getElementById('canvas'), context2D = canvas.getContext('2d'), randomWord, usedLetters, fails, hits, attempts = 6
context2D.canvas.width  = 0, context2D.canvas.height = 0

const bodyParts = [
  [4, 2, 1, 1], //Head
  [4, 3, 1, 2], //Body
  [3, 5, 1, 1], //Legs
  [5, 5, 1, 1], 
  [3, 3, 1, 1], //Arms
  [5, 3, 1, 1] 
]

/* Valida si el caracter ingresado corresponde a una letra del alfabeto y si no existe en la lista de letras ya usadas */
const isAlphabetLetter = (event) => {
  let newLetter = event.key.toUpperCase()    
  if(newLetter.match(/^[A-Za-z]+$/) && !usedLetters.includes(newLetter) && !newLetter.match('ENTER')) {
    verifyLetterInput(newLetter)
  }
}

/* Se agregan al array las letras que ya fueron ingresadas */
const usedLettersList = (letter) => {
  const selectedLetter = document.createElement('span')

  /* Agrega una ',' si hay más de 1 letra */
  selectedLetter.textContent = lettersNotAvailable.children.length > 0 ? `, ${letter.toUpperCase()}` : letter.toUpperCase()
  lettersNotAvailable.appendChild(selectedLetter)
}

/* Verifica si la letra ingresada existe o no en la palabra, además de que la agrega a la lista de letras ya no disponibles */
const verifyLetterInput = (letter) => {
  randomWord.includes(letter) ? correctLetter(letter) : incorrectLetter()    
  lettersNotAvailable.style.display = 'flex'

  usedLettersList(letter)
  usedLetters.push(letter)
}

/* Elige de manera aleatoria una de las palabras de la lista */
const selectRandomWord = () => {
  let word = words[Math.floor((Math.random() * words.length))].toUpperCase()
  randomWord = word.split('')
  totalLetters.textContent = `Palabra de ${randomWord.length} letras:`      
  selectedWord.innerHTML = `La palabra era: ${word}`
}

/* Genera un elemento 'span' por cada letra de la palabra aleatoria */
const generateWordLetters = () => {
  randomWord.forEach(letter => {
    const letterElement = document.createElement('span')
    letterElement.classList.add('letter'), letterElement.classList.add('hidden')
    letterElement.innerHTML = letter.toUpperCase()

    word.appendChild(letterElement)
  })
}

/* Función que genera la parte del cuerpo dependiendo el turno para agregarla al canvas */
const addBodyPart = (bodyPart) => {    
  let rectColor = fails === 1 ? '#011638' : '#E0AC69'
  context2D.fillStyle = rectColor
  context2D.fillRect(...bodyPart) //* fillRect() dibuja un rectangulo con relleno
}

/* Asigna la parte del cuerpo de acuerdo al turno y controla los intentos restantes */
const incorrectLetter = () => {
  addBodyPart(bodyParts[fails])
  fails++

  if (fails === bodyParts.length) gameOver()

  attempts--
  totalAttempts.style.display = 'block'
  renderAttempts()

  canvas.style.animation = 'fa-shake 1s ease-out 1'
  setTimeout(() => { canvas.style.animation = '' }, 500)
} 

/* Renderiza los intentos con el ícono de corazón, o muestra Game Over cuando se terminan los intentos */
const MAX_ATTEMPTS = 6
const renderAttempts = () => {
  if (attempts === 0) {
    totalAttempts.innerHTML = `<i class="fa-solid fa-circle-xmark"></i> Game Over`
    return
  }

  let hearts = ''
  for (let i = 0; i < MAX_ATTEMPTS; i++) {
    hearts += `<i class="fa-solid fa-heart ${ i < attempts ? 'heart-active' : 'heart-lost' }"></i>`
  }
  totalAttempts.innerHTML = hearts
}

/* Función que se llama cada que la letra ingresada existe en la palabra */
const correctLetter = (letter) => {
  const { children: wordLetters } =  word    
  for(let i = 0; i < wordLetters.length; i++) {
    if(wordLetters[i].innerHTML === letter) {
      wordLetters[i].classList.toggle('hidden')
      hits++
    }
  }
  hits === randomWord.length ? wonGame() : null
}

/* Funciónes que se llaman al perder o ganar el juego */
const gameOver = () => {
  document.removeEventListener('keypress', isAlphabetLetter)
  playGameBtn.style.display = 'block'
  playGameBtn.innerHTML = `Has perdido... <i class="fa-solid fa-face-frown"></i>`
  selectedWord.style.display = 'initial'
}
const wonGame = () => {
  document.removeEventListener('keypress', isAlphabetLetter)
  playGameBtn.style.display = 'block'
  playGameBtn.innerHTML = `¡Ganaste! <i class="fa-solid fa-trophy"></i>`    
}

/* Genera la 'horca' en el canvas para iniciar con el juego */
const generateGallow = () => {
  context2D.canvas.width  = 120, context2D.canvas.height = 160
  context2D.scale(20, 20)
  context2D.clearRect(0, 0, canvas.width, canvas.height) //* clearRect() limpia los píxeles específicos del canvas
  context2D.fillStyle = '#141414'
  context2D.fillRect(0, 7, 4, 1), context2D.fillRect(1, 0, 1, 8), context2D.fillRect(2, 0, 3, 1), context2D.fillRect(4, 1, 1, 1)
}

/* Da inicio al juego llamando a las funciónes correspondientes y al evento 'keydown' */
const initGame = () => {
  resetElements()    
  selectRandomWord()
  generateWordLetters()
  generateGallow()    
  document.addEventListener('keypress', isAlphabetLetter)
}
playGameBtn.addEventListener('click', initGame)

/* Resetea los elementos para iniciar un nuevo juego */
const resetElements = () => {
  canvasContainer.style.display = 'initial', selectedWord.style.display = 'none', lettersNotAvailable.style.display = 'none', 
    playGameBtn.style.display = 'none', totalAttempts.style.display = 'none'
  usedLetters = []
  fails = 0, hits = 0, attempts = 6
  word.innerHTML = '', lettersNotAvailable.innerHTML = ''
}