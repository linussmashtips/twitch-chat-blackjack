const express = require('express');
const app = express();
const port = process.env.PORT || 8000;

const players = {}; // Store player data
const dealer = { cards: [], total: 0, state: 'playing' }; // Dealer state

// Utility: Get a random card
function getRandomCard() {
  const cards = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
  return cards[Math.floor(Math.random() * cards.length)];
}

// Utility: Calculate total for a hand, handling Aces dynamically
function calculateTotal(cards) {
  let total = 0;
  let aceCount = 0;

  // First pass: Treat Aces as 11 initially
  for (const card of cards) {
    if (['J', 'Q', 'K'].includes(card)) {
      total += 10;
    } else if (card === 'A') {
      total += 11;
      aceCount += 1;
    } else {
      total += parseInt(card);
    }
  }

  // Adjust Aces from 11 to 1 if total exceeds 21
  while (total > 21 && aceCount > 0) {
    total -= 10; // Reduce an Ace from 11 to 1
    aceCount -= 1;
  }

  return total;
}

// Join the game (!bj)
function joinGame(playerName) {
  if (!players[playerName]) {
    players[playerName] = { cards: [], total: 0, state: 'joined' };
    return `${playerName} has joined the game!`;
  } else {
    // Reset player's game state
    players[playerName].cards = [];
    players[playerName].total = 0;
    players[playerName].state = 'joined';
    return `${playerName} has rejoined the game!`;
  }
}

// Deal cards (!deal)
function dealCards(playerName) {
  if (!players[playerName]) {
    return "You need to join the game first using !bj";
  }

  if (players[playerName].state !== 'joined') {
    return `${playerName}, you need to start a new game by using !bj before dealing.`;
  }

  // Reset dealer's state at the start of a new round
  dealer.cards = [];
  dealer.total = 0;
  dealer.state = 'playing';

  // Deal two cards to player
  players[playerName].cards = [getRandomCard(), getRandomCard()];
  players[playerName].total = calculateTotal(players[playerName].cards);
  players[playerName].state = 'playing';

  // Deal two cards to dealer
  dealer.cards = [getRandomCard(), getRandomCard()];
  dealer.total = calculateTotal(dealer.cards);

  return `${playerName} was dealt: ${players[playerName].cards.join(', ')} (Total: ${players[playerName].total}). Dealer shows: ${dealer.cards[0]}`;
}

// Hit (!hit)
function hit(playerName) {
  if (!players[playerName]) {
    return "You need to join the game first using !bj";
  }

  if (players[playerName].state !== 'playing') {
    return `${playerName} cannot hit. You are either busted or finished playing.`;
  }

  const newCard = getRandomCard();
  players[playerName].cards.push(newCard);
  players[playerName].total = calculateTotal(players[playerName].cards);

  if (players[playerName].total > 21) {
    players[playerName].state = 'bust'; // Player busts
    return `${playerName} busted with ${newCard} (Total: ${players[playerName].total}).`;
  }

  return `${playerName} was dealt: ${newCard} (Total: ${players[playerName].total}).`;
}

// Stand (!stand)
function stand(playerName) {
  if (!players[playerName]) {
    return "You need to join the game first using !bj";
  }

  if (players[playerName].state !== 'playing') {
    return `${playerName} cannot stand. You are either busted or finished playing.`;
  }

  players[playerName].state = 'finished'; // Player stands

  // Dealer's turn
  while (calculateTotal(dealer.cards) < 17) {
    const dealerCard = getRandomCard();
    dealer.cards.push(dealerCard);
  }

  dealer.total = calculateTotal(dealer.cards);

  // Determine outcome
  const result = determineOutcome(playerName);
  return `${playerName} stands. Dealer's cards: ${dealer.cards.join(', ')} (Total: ${dealer.total}). ${result}`;
}

// Determine outcome
function determineOutcome(playerName) {
  const playerTotal = players[playerName].total;
  const dealerTotal = dealer.total;

  if (players[playerName].state === 'bust') {
    return `${playerName} loses!`;
  }

  if (dealerTotal > 21) {
    return `${playerName} wins! Dealer busts!`;
  }

  if (playerTotal > dealerTotal) {
    return `${playerName} wins!`;
  } else if (playerTotal < dealerTotal) {
    return `${playerName} loses!`;
  } else {
    return `${playerName} and dealer tie!`;
  }
}

// API endpoint to process commands from Nightbot
app.get('/', (req, res) => {
  const cmd = req.query.cmd;
  const user = req.query.user;
  
  let response;
  switch(cmd) {
    case 'bj':
      response = joinGame(user);
      break;
    case 'deal':
      response = dealCards(user);
      break;
    case 'hit':
      response = hit(user);
      break;
    case 'stand':
      response = stand(user);
      break;
    default:
      response = "Unknown command.";
  }
  
  res.send(response);
});

// Start the server
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
