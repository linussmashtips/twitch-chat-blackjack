const express = require('express');
const app = express();
const port = process.env.PORT || 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Utility: Get a random card
function getRandomCard() {
    const cards = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    return cards[Math.floor(Math.random() * cards.length)];
}

// Utility: Calculate card value (J, Q, K = 10, A = 1 or 11)
function getCardValue(card, currentTotal) {
    if (['J', 'Q', 'K'].includes(card)) {
        return 10;
    } else if (card === 'A') {
        return (currentTotal + 11 > 21) ? 1 : 11; // Ace is either 1 or 11
    } else {
        return parseInt(card);
    }
}

// Store player data
let players = {};

// Join the game
function joinGame(playerName) {
    if (!players[playerName]) {
        players[playerName] = { cards: [], total: 0, status: 'joined' };
        return `${playerName} has joined the game!`;
    } else {
        // Reset the player's data
        players[playerName].cards = [];
        players[playerName].total = 0;
        players[playerName].status = 'joined';
        return `${playerName} has rejoined the game!`;
    }
}

// Deal initial cards
function dealCards(playerName) {
    if (!players[playerName]) {
        return "Use !bj to join first.";
    }

    // Deal two cards
    const card1 = getRandomCard();
    const card2 = getRandomCard();
    players[playerName].cards.push(card1, card2);
    players[playerName].total = getCardValue(card1, 0) + getCardValue(card2, 0);

    return `${playerName} dealt: ${card1}, ${card2}. Total: ${players[playerName].total}`;
}

// Hit (draw a new card)
function hit(playerName) {
    if (!players[playerName]) {
        return "You need to join the game first using !bj";
    }

    if (players[playerName].total >= 21) {
        return `${playerName} has already busted or reached 21!`;
    }

    const newCard = getRandomCard();
    players[playerName].cards.push(newCard);
    players[playerName].total += getCardValue(newCard, players[playerName].total);

    if (players[playerName].total > 21) {
        players[playerName].status = 'bust';
        return `${playerName} busted with ${newCard} (Total: ${players[playerName].total})`;
    } else {
        return `${playerName} was dealt: ${newCard} (Total: ${players[playerName].total})`;
    }
}

// Split cards (simplified)
function split(playerName) {
    if (!players[playerName]) {
        return "You need to join the game first using !bj";
    }

    if (players[playerName].cards.length < 2 || players[playerName].cards[0] !== players[playerName].cards[1]) {
        return "You can only split if you have two identical cards.";
    }

    // Split logic here (this can be more complex)
    // For now, let's just return a message
    return `${playerName} has split their cards!`;
}

// Double down (simplified)
function double(playerName) {
    if (!players[playerName]) {
        return "You need to join the game first using !bj";
    }

    // Simplified double down (just add a card)
    const newCard = getRandomCard();
    players[playerName].cards.push(newCard);
    players[playerName].total += getCardValue(newCard, players[playerName].total);

    if (players[playerName].total > 21) {
        players[playerName].status = 'bust';
        return `${playerName} doubled down and busted with ${newCard} (Total: ${players[playerName].total})`;
    } else {
        return `${playerName} doubled down and was dealt: ${newCard} (Total: ${players[playerName].total})`;
    }
}

// API endpoint to process commands
app.get('/', (req, res) => {
    const cmd = req.query.cmd;
    const user = req.query.user;

    let response;

    switch (cmd) {
        case 'bj':
            response = joinGame(user);
            break;
        case 'deal':
            response = dealCards(user);
            break;
        case 'hit':
            response = hit(user);
            break;
        case 'split':
            response = split(user);
            break;
        case 'double':
            response = double(user);
            break;
        default:
            response = "Unknown command.";
    }

    res.send(response);
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
