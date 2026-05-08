// admin.js (Original)
const minhaChaveSecreta = "dancezone_2026_protegido"; // Sua chave

if (localStorage.getItem("token_admin") !== minhaChaveSecreta) {
    document.body.innerHTML = "<h1>Acesso Negado</h1>";
    window.location.href = "index.html";
}

/* =========================================
PEGAR USUÁRIO ATUAL
========================================= */

const currentUser =
  JSON.parse(
    localStorage.getItem("currentUser")
  );

/* =========================================
PEGAR USUÁRIOS
========================================= */

let users =
  JSON.parse(
    localStorage.getItem("forumUsers")
  ) || [];

/* =========================================
CRIAR ADMIN AUTOMATICAMENTE
========================================= */

const adminExists =
  users.some(
    user => user.username === "admin"
  );

if(!adminExists){

  users.push(ADMIN);

  localStorage.setItem(
    "forumUsers",
    JSON.stringify(users)
  );

}

/* =========================================
PROTEÇÃO ADMIN
========================================= */

if(
  !currentUser ||
  currentUser.username !== "admin"
){

  window.location.href =
    "comunidade.html";

}

/* =========================================
CONTAINER
========================================= */

const usersContainer =
  document.getElementById("usersContainer");

/* =========================================
RENDERIZAR USUÁRIOS
========================================= */

function renderUsers(){

  usersContainer.innerHTML = "";

  users.forEach((user, index) => {

    const card =
      document.createElement("div");

    card.classList.add("user-card");

    if(user.banned){
      card.classList.add("banned");
    }

    card.innerHTML = `

      <h3>
        👤 ${user.username}
      </h3>

      <div class="user-actions">

        <button
          class="ban-btn"
          onclick="toggleBan(${index})"
        >
          ${
            user.banned
            ? "Desbanir"
            : "Banir"
          }
        </button>

        ${
          user.username !== "admin"
          ? `
            <button
              class="delete-btn"
              onclick="deleteUser(${index})"
            >
              Excluir
            </button>
          `
          : ""
        }

      </div>
    `;

    usersContainer.appendChild(card);

  });

}

/* =========================================
BANIR / DESBANIR
========================================= */

function toggleBan(index){

  /* impedir banir admin */

  if(users[index].username === "admin"){
    alert("Você não pode banir o admin.");
    return;
  }

  users[index].banned =
    !users[index].banned;

  localStorage.setItem(
    "forumUsers",
    JSON.stringify(users)
  );

  renderUsers();

}

/* =========================================
EXCLUIR USUÁRIO
========================================= */

function deleteUser(index){

  /* impedir excluir admin */

  if(users[index].username === "admin"){
    alert("Você não pode excluir o admin.");
    return;
  }

  const confirmDelete =
    confirm(
      `Excluir usuário "${users[index].username}" ?`
    );

  if(confirmDelete){

    users.splice(index, 1);

    localStorage.setItem(
      "forumUsers",
      JSON.stringify(users)
    );

    renderUsers();

  }

}

/* =========================================
INICIAR
========================================= */

renderUsers();