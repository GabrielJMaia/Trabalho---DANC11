const createTopicBtn =
  document.getElementById("createTopicBtn");

const topicsContainer =
  document.getElementById("topicsContainer");

const recentTopics =
  document.getElementById("recentTopics");

const topicMessage =
  document.getElementById("topicMessage");

const messageCount =
  document.getElementById("messageCount");

/* =========================================
ADMIN
========================================= */

const ADMIN = {
  username:"admin",
  password:"1234",
  banned:false
};

/* =========================================
USUÁRIOS
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
USUÁRIO ATUAL
========================================= */

let currentUser =
  JSON.parse(
    localStorage.getItem("currentUser")
  ) || null;

/* =========================================
TOPICOS
========================================= */

let topics =
  JSON.parse(
    localStorage.getItem("topics")
  ) || [];

/* =========================================
SALVAR
========================================= */

function saveTopics(){

  localStorage.setItem(
    "topics",
    JSON.stringify(topics)
  );

}

/* =========================================
PERMISSÃO
========================================= */

function canEditOrDelete(topic){

  if(!currentUser){
    return false;
  }

  if(currentUser.username === "admin"){
    return true;
  }

  if(topic.author !== currentUser.username){
    return false;
  }

  const fiveMinutes =
    5 * 60 * 1000;

  return (
    Date.now() - topic.createdAt
    <= fiveMinutes
  );

}

/* =========================================
RENDER
========================================= */

function renderTopics(){

  if(!topicsContainer) return;

  topicsContainer.innerHTML = "";

  if(recentTopics){
    recentTopics.innerHTML = "";
  }

  const topicCount =
    document.getElementById("topicCount");

  if(topicCount){
    topicCount.innerText =
      topics.length;
  }

  topics.forEach((topic, index) => {

    const topicCard =
      document.createElement("div");

    topicCard.classList.add("topic-card");

    topicCard.innerHTML = `

      ${
        currentUser &&
        currentUser.username === "admin"

        ?

        `
          <button
            class="admin-delete"
            onclick="deleteTopic(${index})"
          >
            ✕
          </button>
        `

        :

        ""
      }

      <h3>${topic.title}</h3>

      <span class="topic-author">
        👤 ${topic.author}
      </span>

      ${
        topic.isEditing

        ?

        `
          <div class="edit-area">

            <input
              type="text"
              id="edit-title-${index}"
              value="${topic.title}"
              maxlength="60"
            >

            <textarea
              id="edit-message-${index}"
              maxlength="500"
            >${topic.message}</textarea>

            <div class="char-counter">
              ${topic.message.length}/500
            </div>

            <button
              class="save-edit"
              onclick="saveEdit(${index})"
            >
              Salvar
            </button>

          </div>
        `

        :

        `
          <p>${topic.message}</p>

          <div class="like-area">

            <button
              class="like-btn"
              onclick="likeTopic(${index})"
            >
              👍 Curtir
            </button>

            <span>
              ${topic.likes || 0} curtidas
            </span>

          </div>
        `
      }

      ${
        currentUser &&
        currentUser.username !== "admin" &&
        currentUser.username === topic.author &&
        canEditOrDelete(topic)

        ?

        `
          <div class="topic-actions">

            <button
              class="edit-topic"
              onclick="editTopic(${index})"
            >
              Editar
            </button>

            <button
              class="delete-topic"
              onclick="deleteTopic(${index})"
            >
              Excluir
            </button>

          </div>
        `

        :

        ""
      }

      <div class="reply-box">

        <textarea
          id="reply-${index}"
          placeholder="Responder..."
          maxlength="300"
          oninput="
            document.getElementById(
              'reply-count-${index}'
            ).innerText =
            this.value.length
          "
        ></textarea>

        <div class="char-counter">
          <span id="reply-count-${index}">
            0
          </span>/300
        </div>

        <button onclick="addReply(${index})">
          Responder
        </button>

      </div>

      <div class="replies">

        ${
          topic.replies.map((reply, replyIndex) => `

            <div class="reply">

              ${
                currentUser &&
                currentUser.username === "admin"

                ?

                `
                  <button
                    class="reply-delete"
                    onclick="deleteReply(${index}, ${replyIndex})"
                  >
                    ✕
                  </button>
                `

                :

                ""
              }

              <strong>
                👤 ${reply.author}
              </strong>

              <p>${reply.message}</p>

            </div>

          `).join("")
        }

      </div>

    `;

    topicsContainer.appendChild(topicCard);

  });

  /* =========================================
  TOPICOS EM DESTAQUE
  ========================================= */

  const highlightedTopics = [...topics]
    .sort((a, b) => (b.likes || 0) - (a.likes || 0))
    .slice(0, 2);

  highlightedTopics.forEach((topic) => {

    const recentCard =
      document.createElement("div");

    recentCard.classList.add("recent-card");

    recentCard.innerHTML = `

      <h3>${topic.title}</h3>

      <span class="topic-author">
        👤 ${topic.author}
      </span>

      <p>
        ${topic.message.substring(0, 80)}...
      </p>

      <div class="topic-like-info">
        👍 ${topic.likes || 0} curtidas
      </div>

    `;

    recentTopics.appendChild(recentCard);

  });

}




/*=========================================
CURTIR TOPICO
========================================= */

function likeTopic(index){

  if(!currentUser){

    alert("Faça login para curtir.");

    return;

  }

  const topic = topics[index];

  /* autor nao pode curtir */

  if(topic.author === currentUser.username){

    alert(
      "Você não pode curtir seu próprio tópico."
    );

    return;

  }

  /* cria array de curtidas */

  if(!topic.likedBy){
    topic.likedBy = [];
  }

  /* verifica se ja curtiu */

  const alreadyLiked =
    topic.likedBy.includes(
      currentUser.username
    );

  if(alreadyLiked){

    alert(
      "Você já curtiu este tópico."
    );

    return;

  }

  /* adiciona curtida */

  topic.likedBy.push(
    currentUser.username
  );

  if(!topic.likes){
    topic.likes = 0;
  }

  topic.likes++;

  saveTopics();

  renderTopics();

}



/* =========================================
CRIAR TOPICO
========================================= */

if(createTopicBtn){

  createTopicBtn.addEventListener("click", () => {

    if(!currentUser){

      alert(
        "Faça login para criar tópicos."
      );

      return;

    }

    const title =
      document.getElementById("topicTitle").value;

    const message =
      document.getElementById("topicMessage").value;

    if(
      title.trim() === "" ||
      message.trim() === ""
    ){

      alert("Preencha os campos.");

      return;

    }

    topics.unshift({

      title,
      message,

      author: currentUser.username,

      createdAt: Date.now(),

      replies:[],

      likes:0,

      likedBy:[],

      isEditing:false


    });

    saveTopics();

    renderTopics();

    document.getElementById(
      "topicTitle"
    ).value = "";

    document.getElementById(
      "topicMessage"
    ).value = "";

    messageCount.innerText = "0";

  });

}


/* =========================================
RESPONDER
========================================= */

function addReply(index){

  if(!currentUser){

    alert(
      "Faça login para responder."
    );

    return;

  }

  const input =
    document.getElementById(
      `reply-${index}`
    );

  if(input.value.trim() === ""){
    return;
  }

  topics[index].replies.push({

    author: currentUser.username,

    message: input.value

  });

  saveTopics();

  renderTopics();

}

/* =========================================
EDITAR
========================================= */

function editTopic(index){

  const topic = topics[index];

  if(!canEditOrDelete(topic)){
    return;
  }

  topic.isEditing = true;

  renderTopics();

}

/* =========================================
SALVAR EDIÇÃO
========================================= */

function saveEdit(index){

  const newTitle =
    document.getElementById(
      `edit-title-${index}`
    ).value;

  const newMessage =
    document.getElementById(
      `edit-message-${index}`
    ).value;

  if(
    newTitle.trim() === "" ||
    newMessage.trim() === ""
  ){
    return;
  }

  topics[index].title =
    newTitle;

  topics[index].message =
    newMessage;

  topics[index].isEditing =
    false;

  saveTopics();

  renderTopics();

}

/* =========================================
DELETAR TOPICO
========================================= */

function deleteTopic(index){

  const topic = topics[index];

  if(!canEditOrDelete(topic)){

    alert(
      "Você não pode apagar este tópico."
    );

    return;

  }

  const confirmDelete =
    confirm(
      "Deseja apagar este tópico?"
    );

  if(confirmDelete){

    topics.splice(index, 1);

    saveTopics();

    renderTopics();

  }

}

/* =========================================
DELETAR RESPOSTA
========================================= */

function deleteReply(topicIndex, replyIndex){

  if(
    !currentUser ||
    currentUser.username !== "admin"
  ){
    return;
  }

  const confirmDelete =
    confirm("Apagar comentário?");

  if(confirmDelete){

    topics[topicIndex].replies.splice(
      replyIndex,
      1
    );

    saveTopics();

    renderTopics();

  }

}



/* =========================================
CRIAR CONTA
========================================= */

function registerUser(){

  const username =
    document.getElementById("authUser").value;

  const password =
    document.getElementById("authPass").value;

  if(
    username.trim() === "" ||
    password.trim() === ""
  ){

    alert("Preencha os campos.");

    return;

  }

  /* =========================================
  DEVICE ID
  ========================================= */

  let deviceId =
    localStorage.getItem("deviceId");

  if(!deviceId){

    deviceId =
      "device_" +
      Math.random().toString(36).substring(2) +
      Date.now();

    localStorage.setItem(
      "deviceId",
      deviceId
    );

  }

  /* =========================================
  VERIFICA MULTI CONTA
  ========================================= */

  const sameDevice =
    users.find(

      user =>

        user.deviceId === deviceId &&

        user.username !== "admin"

    );



  if(sameDevice){

    alert(
      "Já existe uma conta criada neste dispositivo."
    );

    return;

  }


  const userExists =
    users.find(
      user =>
        user.username === username
    );

  if(userExists){

    alert(
      "Esse usuário já existe."
    );

    return;

  }

  
  const newUser = {

    username,
    password,

    banned:false,

    deviceId

  };

  users.push(newUser);

  localStorage.setItem(
    "forumUsers",
    JSON.stringify(users)
  );

  alert("Conta criada!");

  document.getElementById(
    "authUser"
  ).value = "";

  document.getElementById(
    "authPass"
  ).value = "";

}

/* =========================================
LOGIN
========================================= */

function loginUser(){

  const username =
    document.getElementById("authUser").value;

  const password =
    document.getElementById("authPass").value;

  const user = users.find(

    user =>

      user.username === username &&
      user.password === password

  );

  if(!user){

    alert(
      "Usuário ou senha inválidos."
    );

    return;

  }

  if(user.banned){

    alert(
      "Você foi banido do fórum."
    );

    return;

  }

  currentUser = user;

  localStorage.setItem(
    "currentUser",
    JSON.stringify(user)
  );

  updateUserUI();

  renderTopics();

  alert("Login realizado!");

}

/* =========================================
LOGOUT
========================================= */

function logoutUser(){

  currentUser = null;

  localStorage.removeItem(
    "currentUser"
  );

  updateUserUI();

  renderTopics();

}

/* =========================================
INTERFACE
========================================= */

function updateUserUI(){

  const loggedUser =
    document.getElementById("loggedUser");

  const logoutBtn =
    document.getElementById("logoutBtn");

  const authPanel =
    document.getElementById("authPanel");

  const adminPanelBtn =
    document.getElementById(
      "adminPanelBtn"
    );

  if(currentUser){

    loggedUser.innerHTML = `
      👤 Logado como
      <strong>
        ${currentUser.username}
      </strong>
    `;

    logoutBtn.style.display =
      "block";

    authPanel.classList.add(
      "logged"
    );

    if(
      currentUser.username === "admin"
    ){

      if(adminPanelBtn){
        adminPanelBtn.style.display =
          "block";
      }

    }else{

      if(adminPanelBtn){
        adminPanelBtn.style.display =
          "none";
      }

    }

  }else{

    loggedUser.innerHTML = "";

    logoutBtn.style.display =
      "none";

    authPanel.classList.remove(
      "logged"
    );

    if(adminPanelBtn){
      adminPanelBtn.style.display =
        "none";
    }

  }

}

/* =========================================
CONTADOR
========================================= */

if(topicMessage){

  topicMessage.addEventListener(
    "input",
    () => {

      messageCount.innerText =
        topicMessage.value.length;

    }
  );

}

/* =========================================
INICIAR
========================================= */

updateUserUI();

renderTopics();