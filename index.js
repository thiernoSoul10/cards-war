let deckId
const cardsContainer = document.getElementById("cards")
const newDeckBtn = document.getElementById("new-deck")
const drawCardBtn = document.getElementById("draw-cards")
const header = document.getElementById("header")
const remainingText = document.getElementById("remaining")
const computerScoreLabel = document.getElementById("computer-score")
const humanScoreLabel = document.getElementById("human-score")

let computerScore = 0
let humanScore = 0

async function handleClick(){
    try {
        const response = await fetch("https://apis.scrimba.com/deckofcards/api/deck/new/shuffle/")
        if(!response.ok)
            throw new Error("Could not connect to the server")

        const data = await response.json()

        remainingText.textContent = `Remaining cards: ${data.remaining}`
        deckId = data.deck_id
        console.log(deckId)
    } catch (error) {
        console.log(error)
    }
}

async function handleDraw() {

    try {
        const response = await fetch(`https://apis.scrimba.com/deckofcards/api/deck/${deckId}/draw/?count=2`)
        if(!response.ok)
            throw new Error("Could not connect to the server!")
        
        data = await response.json()

        remainingText.textContent = `Remaining cards: ${data.remaining}`
        cardsContainer.children[0].innerHTML = `
            <img src=${data.cards[0].image} class="card" />
        `
        cardsContainer.children[1].innerHTML = `
            <img src=${data.cards[1].image} class="card" />
        `
        const winnerText = determineCardWinner(data.cards[0], data.cards[1])
        header.textContent = winnerText
        computerScoreLabel.textContent = computerScore
        humanScoreLabel.textContent = humanScore
        
        if (data.remaining === 0) {
            drawCardBtn.disabled = true
            header.textContent = humanScore > computerScore ? "The Human Wins!"
                : humanScore === computerScore ? "It's a Draw" : "The computer Wins!"
        }
    } catch (error) {
        console.log(error)
    }
}

newDeckBtn.addEventListener("click", handleClick)

drawCardBtn.addEventListener("click", handleDraw)

/**
 * Challenge:
 * 
 * Keep score! Every time the computer wins a hand, add a point to
 * the computer's score. Do the same for every time you win a hand.
 * If it's a war, no points are awarded to either player. If it's 
 * a war (same card values), no one is awarded points.
 * 
 * Display the computer's score above the top card, display your
 * own score BELOW the bottom card.
 * 
 * Track the scores in a global variable defined at the top of this file
 * 
 * Add to the global scores inside the `determineCardWinner` function below.
 */

function determineCardWinner(card1, card2) {
    const valueOptions = ["2", "3", "4", "5", "6", "7", "8", "9", 
    "10", "JACK", "QUEEN", "KING", "ACE"]
    const card1ValueIndex = valueOptions.indexOf(card1.value)
    const card2ValueIndex = valueOptions.indexOf(card2.value)
    
    if (card1ValueIndex > card2ValueIndex) {
        computerScore++
        return "Card 1 wins!"
    } else if (card1ValueIndex < card2ValueIndex) {
        humanScore++
        return "Card 2 wins!"
    } else {
        return "War!"
    }
}

