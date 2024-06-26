const fs = require("fs");

const options = {
  key: fs.readFileSync('C:/Users/kei/Downloads/privkey.pem'),
  cert: fs.readFileSync('C:/Users/kei/Downloads/fullchain.pem'),
};

module.exports = { options };
