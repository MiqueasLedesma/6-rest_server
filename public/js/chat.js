let user = null;
let socket = null;

// html refs
const txtUid = document.querySelector("#txtUid");
const txtMsg = document.querySelector("#txtMsg");
const ulUsers = document.querySelector("#ulUsers");
const ulMsgs = document.querySelector("#ulMsgs");
const btnExit = document.querySelector("#btnExit");

const url = "http://localhost:8080/api/";

const validateJWT = async () => {
  const token = localStorage.getItem("token") || "";
  if (token.length < 10) {
    window.location = "index.html";
    throw new Error("Sin token válido");
  }

  const res = await fetch(url + "auth", {
    headers: {
      Authorization: token,
    },
  });

  if (!res.ok) throw new Error("Request fail - chat.js - line 20");

  const { user: userDB, token: tokenDB } = await res.json();

  user = userDB;
  document.title = userDB.name;
  localStorage.setItem("token", tokenDB);

  await connectSocket(tokenDB);
};

const connectSocket = async (token) => {
  socket = io({
    extraHeaders: {
      Authorization: token,
    },
  });

  socket.on("connect", () => {
    console.log("Socket online");
  });

  socket.on("disconnect", () => {
    console.log("Socket offline");
  });

  socket.on("online-users", drawUsers);

  socket.on("receive-msg", drawMsgs);

  socket.on("private-msg", (payload) => {
    // TODO: Debe reciobir mensajes privados
    console.log({ payload });
  });
};

const drawUsers = (users = []) => {
  let usersHtml = "";

  users.forEach(({ name, uid }) => {
    usersHtml += `
      <li>
        <p>
          <h5 class="text-success">${name}</h5>
          <span class="fs-6 text-muted">${uid}</span>
        </p>
      </li>
    `;
  });

  ulUsers.innerHTML = usersHtml;
};

const drawMsgs = (msgs = []) => {
  let msgsHtml = "";

  msgs.forEach(({ name, message }) => {
    msgsHtml += `
      <li>
        <p>
          <span class="text-primary">${name}:</span>
          <span class="fs-6 text-muted">${message}</span>
        </p>
      </li>
    `;
  });

  ulMsgs.innerHTML = msgsHtml;
};

txtMsg.addEventListener("keyup", ({ keyCode }) => {
  const msg = txtMsg.value?.trim();
  const uid = txtUid.value?.trim();

  if (keyCode !== 13) return;
  if (msg.length === 0) return;

  socket.emit("send-msg", { msg, uid });
  txtMsg.value = "";
});

const main = async () => {
  // Validar JWT
  await validateJWT();
};

main();
