const { Socket } = require("socket.io");
const { checkJWT } = require("../helpers");

const { ChatMessage } = require("../models");

const chatMesagges = new ChatMessage();

const socketController = async (socket = new Socket(), io) => {
  const user = await checkJWT(socket.handshake.headers["authorization"]);
  if (!user) return socket.disconnect();

  // Agregar el usuario conectado
  chatMesagges.connectUser(user);
  io.emit("online-users", chatMesagges.usersArr);
  socket.emit("receive-msg", chatMesagges.lastTen);

  // Conectar usuario a una sala privada
  socket.join(user._id.toJSON());

  // Limpiar usuario desconectado
  socket.on("disconnect", () => {
    chatMesagges.disconnectUser(user._id);
    io.emit("online-users", chatMesagges.usersArr);
  });

  socket.on("send-msg", ({ uid, msg }) => {
    if (uid) {
      // Mensaje privado
      socket.to(uid).emit("private-msg", { from: user.name, msg });
    } else {
      chatMesagges.sendMessage({
        uid: user._id,
        message: msg,
        name: user.name,
      });
      io.emit("receive-msg", chatMesagges.lastTen);
    }
  });
};

module.exports = {
  socketController,
};
