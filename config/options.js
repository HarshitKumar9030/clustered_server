const fs = require("fs");

const options = {
  key: fs.readFileSync('/etc/letsencrypt/live/server.hogwart.tech/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/server.hogwart.tech/fullchain.pem'),
};

module.exports = { options };
