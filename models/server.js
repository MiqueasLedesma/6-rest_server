require("dotenv").config();
const express = require("express");
const cors = require("express");

class Server {
  constructor() {
    this.app = express();
    this.usersPath = "/api/users";
    // Middlewares
    this.middlewares();

    // Rutas de mi app
    this.routes();

    // Puerto
    this.port = process.env.PORT || 8080;
  }

  middlewares() {
    // CORS
    this.app.use(cors());

    // Lectura y parseo del body
    this.app.use(express.json());

    // Directorio publico
    this.app.use(express.static("public"));
  }

  routes() {
    this.app.use(this.usersPath, require("../routes/user.route"));
  }

  listen() {
    this.app.listen(this.port, () =>
      console.log(`Server listening on port${this.port}`)
    );
  }
}

module.exports = Server;
