require("dotenv").config();

const express = require("express");
const cors = require("express");

const { conn } = require("../db/config");

class Server {
  constructor() {
    this.app = express();
    this.usersPath = "/api/users";
    //Conectar DB
    this.dbConn();

    // Middlewares
    this.middlewares();
    
    // Rutas de mi app
    this.routes();

    // Puerto
    this.port = process.env.PORT || 8080;
  }

  async dbConn() {
    await conn();
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
      console.log(`Server listening on port: ${this.port}`)
    );
  }
}

module.exports = Server;
