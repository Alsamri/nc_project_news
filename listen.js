const app = require("./app.js");
const { PORT = 6543 } = process.env;

app.listen(PORT, () => console.log(`Listening on ${PORT}...`));
