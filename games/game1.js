
let winCount = 0
let loseCount = 0

let gamesNum = 0
const gamesTotal = 8

let blocked = false

let patternStr

let currentTime = 0
const gameTime = localStorage.getItem("gameTime")
const displayTimer = document.querySelector('#timer')

const intervalId = setInterval(() => {
    currentTime++
    
    if (currentTime >= gameTime) {   
     finishGame() 
    }
 
    const time = gameTime - currentTime
    const hours = Math.floor(time / 360000)
    const minutes = Math.floor((time % 360000) / 6000)
    const seconds = Math.floor((time % 6000) / 100)
    const milliseconds = time % 100
    const timeToString = `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}:${milliseconds.toString().padStart(2, "0")}`
 
    displayTimer.textContent = timeToString
   
 }, 10) 

const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomPattern = () => Array.from({ length: 16 }, () => getRandomNumber(1, 4))
const getRandomMatrix = () => Array.from({ length: 8 }, () => getRandomPattern())

const randomPuzzles = document.querySelector('.random-puzzles')
const templateul = document.querySelector('.template')

const getRandomFromMatrix = (matrix) => {
    const rowIndex = getRandomNumber(0, matrix.length - 1)
    return matrix[rowIndex]
}

function clearGame() {
    randomPuzzles.innerText = ''
    templateul.innerText = ''
}

function restartGame() {
    gamesNum++
    
    if (gamesNum > gamesTotal) {
        finishGame()
        return
    }

    clearGame()

    currentTime = 0

    const matrix = getRandomMatrix()
    drawMatrix(matrix)

    const template = getRandomFromMatrix(matrix)
    patternStr = template.join('')
    
    createPattern(template, templateul)
}


const createPattern = (pattern, patternul) => {
    for (let j = 0; j < pattern.length; ++j) {
        const segmentColor = pattern[j]
        const segmentli = document.createElement("li")
        segmentli.classList.add(`color-${segmentColor}`)
        patternul.appendChild(segmentli)
    }
} 


function drawMatrix(matrix) {
    for (let i = 0; i < matrix.length; ++i) {
        const pattern = matrix[i]
        const patternul = document.createElement("ul")
        patternul.classList.add("puzzle")

        const patternString = pattern.join('')
        patternul.dataset.value = patternString
        
        createPattern(pattern, patternul)

        const puzzleli = document.createElement("li")
        puzzleli.appendChild(patternul)
        randomPuzzles.appendChild(puzzleli)

        patternul.addEventListener('click', onPatternClick)
    }
}

function onPatternClick (e) {
    e.preventDefault()

    if (blocked) return

    const currentPatternStr = e.currentTarget.dataset.value
    if (currentPatternStr === patternStr) {
        winCount ++
    } else {
        loseCount ++
    }

    const winFrame = document.getElementById("winFrame")
    const loseFrame = document.getElementById("loseFrame")

    winFrame.innerText = winCount
    loseFrame.innerText = loseCount

    console.log (`wins: ${winCount}, lose: ${loseCount}`)
    restartGame()
}

function finishGame() {
   
    blocked = true

    let score = winCount * 50

    const timewatch = document.querySelector('.timewatch')
    timewatch.innerText = `Your score ${score}!`

    clearInterval(intervalId)

    setTimeout(() => {
        let result = +localStorage.getItem("result")
        result += score
        localStorage.setItem("result", result)

        const redirect = localStorage.getItem("redirect")
        window.location.href = redirect
    }, 2000)
}

initGame()

function initGame() {
    winCount = 0
    loseCount = 0
    gamesNum = 0
    blocked = false

    const winFrame = document.getElementById("winFrame")
    const loseFrame = document.getElementById("loseFrame")

    winFrame.innerText = 0
    loseFrame.innerText = 0

    restartGame()
}
 
