// main.js

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

// Utility: Calculate card value (J, Q, K = 10, A = 1 or 11)
function getCardValue(card, currentTotal) {
  if (['J', 'Q', 'K'].includes(card)) {
    return 10;
  } else if (card === 'A') {
    return (currentTotal + 11 > 21) ? 1 : 11;
  } else {
    return parseInt(card);
  }
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

// Deal cards
function dealCards(playerName) {
  if (!players[playerName]) {
    return "You need to join the game first using !bj";
  }

  // Reset dealer's state at the start of a new round
  dealer.cards = [];
  dealer.total = 0;
  dealer.state = 'playing';

  // Check if player is already playing
  if (players[playerName].state !== 'joined') {
    return `${playerName}, you need to start a new game by using !bj before dealing.`;
  }

  // Deal two cards to player
  for (let i = 0; i < 2; i++) {
    players[playerName].cards.push(getRandomCard());
  }

  // Deal two cards to dealer (one face down)
  dealer.cards.push(getRandomCard(), getRandomCard());

  // Calculate total for the player
  players[playerName].total = players[playerName].cards.reduce((total, card) => total + getCardValue(card, total), 0);
  players[playerName].state = 'playing'; // Update state to playing

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
  players[playerName].total += getCardValue(newCard, players[playerName].total);

  if (players[playerName].total > 21) {
    players[playerName].state = 'bust'; // Update state to busted
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
  while (dealer.total < 17) {
    const dealerCard = getRandomCard();
    dealer.cards.push(dealerCard);
    dealer.total += getCardValue(dealerCard, dealer.total);
  }

  // Determine outcome
  let result = determineOutcome(playerName);
  return `${playerName} stands. Dealer's cards: ${dealer.cards.join(', ')} (Total: ${dealer.total}). ${result}`;
}

// Determine outcome
function determineOutcome(playerName) {
  if (players[playerName].state === 'bust') {
    return `${playerName} loses!`;
  }

  if (dealer.total > 21) {
    return `${playerName} wins! Dealer busts!`;
  }

  if (players[playerName].total > dealer.total) {
    return `${playerName} wins!`;
  } else if (players[playerName].total < dealer.total) {
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
