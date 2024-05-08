const dotenv = require("dotenv");
dotenv.config({
  path: "./conf/.env",
});
const app = require("./app");
const connectDb = require("./conf/db.conf");

const PORT = process.env.PORT || 4000;
const HOST = process.env.HOST || "localhost";
const DB_HOST = process.env.DB_HOST;
const DB_NAME = process.env.DB_NAME;

connectDb(`${DB_HOST}/${DB_NAME}`);

app.listen(PORT, () => {
  console.log(`Server is running on port http://${HOST}:${PORT}`);
});
