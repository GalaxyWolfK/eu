// Blackjack Game Logic

let playerChips = 1000;
let currentBet = 0;
let deck = [];
let playerHand = [];
let dealerHand = [];
let playerScore = 0;
let dealerScore = 0;

const suits = ['♠', '♥', '♦', '♣'];
const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
const values = {'2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'J': 10, 'Q': 10, 'K': 10, 'A': 11};

function createDeck() {
    deck = [];
    for (const suit of suits) {
        for (const rank of ranks) {
            deck.push({rank, suit});
        }
    }
    deck = shuffle(deck);
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function dealCards() {
    playerHand = [deck.pop(), deck.pop()];
    dealerHand = [deck.pop(), deck.pop()];
    updateScores();
    renderCards();
    checkForBlackjack();
}

function updateScores() {
    playerScore = calculateScore(playerHand);
    dealerScore = calculateScore(dealerHand);
    document.getElementById('player-score').textContent = playerScore;
    document.getElementById('dealer-score').textContent = dealerHand[0].rank === 'A' ? 11 : values[dealerHand[0].rank];
}

function calculateScore(hand) {
    let score = hand.reduce((acc, card) => acc + values[card.rank], 0);
    const aces = hand.filter(card => card.rank === 'A').length;
    while (score > 21 && aces > 0) {
        score -= 10;
    }
    return score;
}

function renderCards() {
    const playerCardsContainer = document.getElementById('player-cards');
    const dealerCardsContainer = document.getElementById('dealer-cards');
    playerCardsContainer.innerHTML = '';
    dealerCardsContainer.innerHTML = '';
    playerHand.forEach(card => playerCardsContainer.appendChild(createCardElement(card)));
    dealerHand.forEach((card, index) => {
        if (index === 0) {
            dealerCardsContainer.appendChild(createCardElement(card));
        } else {
            dealerCardsContainer.appendChild(createCardBackElement());
        }
    });
}

function createCardElement(card) {
    const cardDiv = document.createElement('div');
    cardDiv.className = 'card ' + (card.suit === '♥' || card.suit === '♦' ? 'red' : 'black');
    cardDiv.innerHTML = `<div class="card-value">${card.rank}</div><div class="card-suit">${card.suit}</div>`;
    return cardDiv;
}

function createCardBackElement() {
    const cardDiv = document.createElement('div');
    cardDiv.className = 'card card-back';
    cardDiv.innerHTML = '🎴';
    return cardDiv;
}

function hit() {
    if (playerHand.length > 0) {  // Ensure game has started
        playerHand.push(deck.pop());
        updateScores();
        renderCards();
        if (playerScore > 21) {
            endGame('lose');
        }
    }
}

function stand() {
    if (playerHand.length > 0) {  // Ensure game has started
        document.getElementById('dealer-cards').innerHTML = '';
        dealerHand.forEach(card => document.getElementById('dealer-cards').appendChild(createCardElement(card)));
        updateScores();
        while (dealerScore < 17) {
            dealerHand.push(deck.pop());
            updateScores();
        }
        if (dealerScore > 21 || playerScore > dealerScore) {
            endGame('win');
        } else if (dealerScore === playerScore) {
            endGame('push');
        } else {
            endGame('lose');
        }
    }
}

function doubleDown() {
    if (playerHand.length === 2) {  // Can only double down on first move
        currentBet *= 2;
        document.getElementById('current-bet').textContent = currentBet;
        hit();
        if (playerScore <= 21) {
            stand();
        }
    }
}

function checkForBlackjack() {
    if (playerScore === 21) {
        endGame('win');
    }
}

function endGame(result) {
    const messageDiv = document.getElementById('game-message');
    if (result === 'win') {
        messageDiv.textContent = 'You win!';
        messageDiv.className = 'game-message win';
        playerChips += currentBet;
    } else if (result === 'lose') {
        messageDiv.textContent = 'You lose!';
        messageDiv.className = 'game-message lose';
        playerChips -= currentBet;
    } else if (result === 'push') {
        messageDiv.textContent = "It's a push!";
        messageDiv.className = 'game-message push';
    }
    document.getElementById('player-chips').textContent = playerChips;
    document.getElementById('betting-controls').style.display = 'none';
    document.getElementById('game-controls').style.display = 'none';
    document.getElementById('new-game-controls').style.display = 'block';
}

function newGame() {
    document.getElementById('betting-controls').style.display = 'block';
    document.getElementById('game-controls').style.display = 'none';
    document.getElementById('new-game-controls').style.display = 'none';
    document.getElementById('game-message').textContent = 'Place your bet to start playing!';
    document.getElementById('game-message').className = 'game-message';
    currentBet = 0;
    deck = [];
    playerHand = [];
    dealerHand = [];
    playerScore = 0;
    dealerScore = 0;
    document.getElementById('player-score').textContent = playerScore;
    document.getElementById('dealer-score').textContent = dealerScore;
    document.getElementById('current-bet').textContent = currentBet;
    document.getElementById('dealer-cards').innerHTML = '';
    document.getElementById('player-cards').innerHTML = '';
    createDeck();
}

function placeBet(amount) {
    if (amount <= playerChips) {
        currentBet = amount;
        document.getElementById('current-bet').textContent = currentBet;
        document.getElementById('deal-btn').disabled = false;
    }
}

document.querySelectorAll('.bet-btn').forEach(btn =e {
    btn.addEventListener('click', (e) =e {
        const betAmount = parseInt(e.target.dataset.amount);
        if (betAmount c= playerChips) {
            currentBet = betAmount;
            document.getElementById('current-bet').textContent = currentBet;
            document.getElementById('deal-btn').disabled = false;
            document.querySelectorAll('.bet-btn').forEach(b =e b.classList.remove('selected'));
            e.target.classList.add('selected');
        }
    });
});

document.getElementById('custom-bet-btn').addEventListener('click', () =e {
    const customBet = parseInt(document.getElementById('custom-bet-input').value);
    if (customBet c= playerChips  customBet e 0) {
        currentBet = customBet;
        document.getElementById('current-bet').textContent = currentBet;
        document.getElementById('deal-btn').disabled = false;
        document.querySelectorAll('.bet-btn').forEach(b =e b.classList.remove('selected'));
    } else {
        alert('Invalid bet amount!');
    }
});

document.getElementById('deal-btn').addEventListener('click', () =e {
    if (currentBet e 0) {
        document.getElementById('betting-controls').style.display = 'none';
        document.getElementById('game-controls').style.display = 'block';
        dealCards();
        document.getElementById('deal-btn').disabled = true;
    }
});

document.getElementById('hit-btn').addEventListener('click', hit);
document.getElementById('stand-btn').addEventListener('click', stand);
document.getElementById('double-btn').addEventListener('click', doubleDown);
document.getElementById('new-game-btn').addEventListener('click', newGame);

newGame();
