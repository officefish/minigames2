
const canves = document.querySelector('#canves')
const restart = canves.querySelector('.restart')
const tower = canves.querySelector('.tower')
const count = document.querySelector('#count')

const rating = 3
let holding = []
let moves = 0
const numDisks = +localStorage.getItem('numDisks')
const minMoves = 127

/* initial auxiliary functions */
function clearTowers () {
   const towers = document.querySelectorAll('.tower')
   towers.forEach((tower) => {
       tower.innerHTML = ''
   })
} 

function initialTower (tower) {
   for (var i = 1; i <= numDisks; i++) {
       const li = document.createElement("li")
       li.classList.add('disk')
       li.classList.add(`disk-${i}`)
       li.dataset.value = i
       tower.prepend(li)
   }
}

// Init Game
function initGame() {
   clearTowers()
   moves = 0
   count.innerHTML = '0'
   holding = []
   initialTower(tower)
}

initGame(tower)

const towers = document.querySelectorAll('.tower')
towers.forEach((tower) => tower.addEventListener('click', onTowerClick))
const lastTower = towers[towers.length - 1]

function countMoves() {
   moves++
   count.innerHTML = `${moves}`
   if(lastTower && lastTower.children.length === numDisks) {
       endGame()
   }
}

function onTowerClick(e) {
   e.preventDefault()
   const currentTower = e.currentTarget
   const disks = currentTower.children
   const topDisk = currentTower.querySelector(':last-child')
       
   const value = topDisk?.dataset.value
   const holdingDisk = canves.querySelector('.hold')

   if (holdingDisk) {
       if (value === holding[0]) {
           holdingDisk.classList.remove('hold')     
       } else if (value === undefined || value > holding[0]) {
           console.log(value)
           holdingDisk.remove()
           const li = document.createElement("li")
           li.classList.add('disk')
           li.classList.add(`disk-${holding[0]}`)
           li.dataset.value = holding[0]
           currentTower.appendChild(li)
           countMoves()
       }
   } else if (topDisk) {
       topDisk.classList.add('hold')
       holding[0] = value
   }
}

function endGame() {
   const bestResult = 2**numDisks - 1
   let score = 100
   if ( moves === bestResult ) {
      score = 300
   } else if (moves <= bestResult + (bestResult / 2)) {
     score = 200
   } 

   setTimeout(() => {
    let result = +localStorage.getItem("result")
    result += score
    localStorage.setItem("result", result)

    const redirect = localStorage.getItem("redirect")
    window.location.href = redirect
}, 2000)
}
