require("dotenv").config();

const express = require("express");
const cors = require("express");

const { conn } = require("../db/config");

class Server {
  constructor() {
    this.app = express();
    this.paths = {
      auth: "/api/auth",
      categories: "/api/categories",
      users: "/api/users",
      products: "/api/products",
      search: "/api/search",
    };

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
    this.app.use(this.paths.auth, require("../routes/auth.route"));
    this.app.use(this.paths.users, require("../routes/user.route"));
    this.app.use(this.paths.categories, require("../routes/categories.route"));
    this.app.use(this.paths.products, require("../routes/products.route"));
    this.app.use(this.paths.search, require("../routes/search.route"));
  }

  listen() {
    this.app.listen(this.port, () =>
      console.log(`Server listening on port: ${this.port}`)
    );
  }
}

module.exports = Server;
