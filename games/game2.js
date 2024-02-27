let blocked = false

const getRandomLetter = () => String.fromCharCode(97 + Math.floor(Math.random() * 26));
    
const shuffleItems = (items) => {
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]]
  }
  return items
}

const getRandomColor = () => {
    return "#"+((1<<24)*Math.random()|0).toString(16) 
}

const words = ["book", "jump", "time", "play", "star", "tree", "cake", "song", "gold", "word", "plan", "frog"]
const randomIndex = Math.floor(Math.random() * words.length)
const randomWord = words[randomIndex]

let numLetters = +localStorage.getItem('numLettes')
if (!numLetters) {
    numLetters = 20
}
const letters = randomWord.split('')
let count = 0
const numQuizLetters = letters.length
numLetters -= letters.length

const quizContainer = document.querySelector('.quiz-letters')
for (let i = 0; i < letters.length; i++) {
    const li = document.createElement("li")        
    li.classList.add("quiz-letter")
    li.innerText = letters[i]
    li.dataset.value = "droptarget"
    quizContainer.appendChild(li)
}

const randomLetters = Array.from({ length: numLetters }, getRandomLetter)
const finalArray = letters.concat(randomLetters)

const shuffled = shuffleItems(finalArray)

let dragged = null

const randomContainer = document.querySelector('.random-letters')
for (let i = 0; i < shuffled.length; i++)
{
    document.documentElement.style.setProperty(`--random-color-${i}`, getRandomColor())
    document.documentElement.style.setProperty(`--random-bg-color-${i}`, getRandomColor())
    
    const li = document.createElement("li")
    li.draggable = true
    
    li.classList.add(`random-color-${i}`)
    li.classList.add(`random-bg-${i}`)
    li.innerText = shuffled[i]
    randomContainer.appendChild(li)
}

document.addEventListener("dragstart", (event) => {
    if(blocked) return
    dragged = event.target

})

document.addEventListener("dragover", function(event) {
    event.preventDefault()
    if(blocked) return
})

document.addEventListener('drop', function(event) {
    event.preventDefault()
    if(blocked) return

    if (event.target.dataset.value != 'droptarget') {
        return          
    }

    if (event.target.innerText !== dragged.innerText) {
        return
    }

    event.target.classList.remove('quiz-letter')
    event.target.classList.add('quiz-letter-done')

    dragged.remove()

    count++

    if (count == numQuizLetters) {
        finishGame(100)
    }
})

let currentTime = 0
const gameTime = localStorage.getItem("gameTime")
const displayTimer = document.querySelector('#timer')

const intervalId = setInterval(() => {
    currentTime++
    
    if (currentTime >= gameTime) {   
     finishGame(0) 
    }
 
    const time = gameTime - currentTime
    const hours = Math.floor(time / 360000)
    const minutes = Math.floor((time % 360000) / 6000)
    const seconds = Math.floor((time % 6000) / 100)
    const milliseconds = time % 100
    const timeToString = `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}:${milliseconds.toString().padStart(2, "0")}`
 
    displayTimer.textContent = timeToString
   
 }, 10) 
 

function finishGame(score) {

    blocked = true
    clearInterval(intervalId)

    if (currentTime <= 500) {
        score = 300
    } else if (currentTime <= 1000) {
        score = 200
    }

    displayTimer.remove()
    const timewatch = document.querySelector('.timewatch')
    timewatch.innerText = `Your score ${score}!`

    setTimeout(() => {
        let result = +localStorage.getItem("result")
        result += score
        localStorage.setItem("result", result)

        const redirect = localStorage.getItem("redirect")
        window.location.href = redirect
    }, 2000)
}