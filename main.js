const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Sample route to handle Nightbot commands
app.get('/nightbot', (req, res) => {
  const cmd = req.query.cmd;
  const user = req.query.user;

  switch (cmd) {
    case 'bj':
      res.send(`${user} joined the game!`);
      break;
    case 'deal':
      res.send(`${user} was dealt two cards.`);
      break;
    case 'hit':
      res.send(`${user} hits.`);
      break;
    default:
      res.send('Unknown command.');
  }
});

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
