# Blackjack Nightbot Integration

This repository contains a simple Blackjack game server that integrates with Nightbot. Players can interact with the game using Nightbot commands, and the server will process the game logic and return responses accordingly.

### Features:
- Players can join the game, deal cards, hit, and stand through Nightbot commands.
- The game simulates a Blackjack game with a dealer and player(s).
- The dealer draws cards until their total is 17 or higher.
- The game supports multiple players simultaneously, tracking their states (joined, playing, bust, finished).

### How It Works:

This script exposes an API endpoint that can process commands sent by Nightbot. The Nightbot command structure is as follows:

- **!bj** - Join the game.
- **!deal** - Deal cards to the player and start a new round.
- **!hit** - Player draws a new card.
- **!stand** - Player stands, and the dealer's turn begins.

Nightbot can send HTTP GET requests to the game server with the player's name and the desired command.

### Example Nightbot Commands:

To use the commands in Nightbot, simply configure Nightbot with the following commands:

- **Join the game:**
  \`\`\`plaintext
  $(user) $(urlfetch https://your-deployment-url.com/?cmd=bj&user=$(user))
  \`\`\`

- **Deal cards:**
  \`\`\`plaintext
  $(user) $(urlfetch https://your-deployment-url.com/?cmd=deal&user=$(user))
  \`\`\`

- **Hit:**
  \`\`\`plaintext
  $(user) $(urlfetch https://your-deployment-url.com/?cmd=hit&user=$(user))
  \`\`\`

- **Stand:**
  \`\`\`plaintext
  $(user) $(urlfetch https://your-deployment-url.com/?cmd=stand&user=$(user))
  \`\`\`

Make sure to replace `https://your-deployment-url.com` with the actual URL of your deployed server.

### Setup Instructions:

1. Clone this repository to your local machine:
   \`\`\`bash
   git clone https://github.com/your-repository-name/blackjack-nightbot.git
   \`\`\`

2. Navigate to the project directory:
   \`\`\`bash
   cd blackjack-nightbot
   \`\`\`

3. Install the required dependencies:
   \`\`\`bash
   npm install
   \`\`\`

4. Configure and start your server:
   \`\`\`bash
   node main.js
   \`\`\`

   The server will start and listen on port 8000 (or any port defined in the `PORT` environment variable).

5. Deploy your application to a cloud platform (e.g., Koyeb, Heroku, or another platform) to get a publicly accessible URL.

6. Set up the Nightbot custom commands as described above.

### API Endpoints:

- **`GET /?cmd=bj&user=<username>`** – Player joins the game.
- **`GET /?cmd=deal&user=<username>`** – Deal cards to the player.
- **`GET /?cmd=hit&user=<username>`** – Player hits and draws a card.
- **`GET /?cmd=stand&user=<username>`** – Player stands and ends their turn.

### Example Output:

For each command, the server will respond with a message like:

- `John has joined the game!`
- `John was dealt: 8, 5 (Total: 13). Dealer shows: 10`
- `John was dealt: 3 (Total: 16).`
- `John stands. Dealer's cards: 10, 6, 3 (Total: 19). John loses!`

### License:

This project is licensed under the MIT License - see the [MIT License](https://opensource.org/licenses/MIT) for details.
