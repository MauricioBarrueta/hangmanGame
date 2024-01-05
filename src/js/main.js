const word = document.querySelector('.word'), lettersNotAvailable = document.querySelector('.used-letters'),
    playGameBtn = document.getElementById('playButton'), canvasContainer = document.querySelector('.canvas-container'),
    totalAttempts = document.querySelector('.canvas-container span'), selectedWord = document.querySelector('.word-preview'), 
    totalLetters = document.getElementById('totalLetters')

window.onload = () => {
    canvasContainer.style.display = 'none', lettersNotAvailable.style.display = 'none', selectedWord.style.display = 'none'
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
    selectedLetter.innerHTML = letter.toUpperCase()
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
    totalLetters.textContent = `Es una palabra de ${randomWord.length} letras:`      
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
    let rectColor = fails === 1 ? '#0D21A1' : '#E0AC69'
    context2D.fillStyle = rectColor
    context2D.fillRect(...bodyPart) //* fillRect() dibuja un rectangulo con relleno
}

/* Función que asigna la parte del cuerpo dependiendo el número del turno */
const incorrectLetter = () => {
    addBodyPart(bodyParts[fails])
    fails++    
    fails === bodyParts.length ? gameOver() : null

    totalAttempts.style.display = 'block'
    attempts--
    totalAttempts.innerHTML = attempts > 1 ? `Te quedan ${attempts} intentos` : attempts == 1 ? `Te queda ${attempts} intento` 
        : '\u{f54c} Game Over \u{f54c}'
        
    canvas.style.animation = 'fa-shake 1s ease-out 1'
    setTimeout(() => { canvas.style.animation = '' }, 500)
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
    playGameBtn.innerHTML = 'Perdiste... \u{f01e}'
    selectedWord.style.display = 'initial'
}
const wonGame = () => {
    document.removeEventListener('keypress', isAlphabetLetter)
    playGameBtn.style.display = 'block'
    playGameBtn.innerHTML = 'Ganaste!! \u{f521}'    
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