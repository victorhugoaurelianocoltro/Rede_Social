const API_BASE = "https://back-spider.vercel.app";
let idPublicacaoAtual = null;
let listaUsuarios = [];

// Carrega tudo ao iniciar a página
window.onload = async function () {
  const container = document.getElementById("postagens");

  try {
    // 1. Carrega usuários
    const respostaUsers = await fetch(`${API_BASE}/user/listarUsers`);
    listaUsuarios = await respostaUsers.json();

    // 2. Carrega publicações
    const respostaPubli = await fetch(`${API_BASE}/publicacoes/listarPublicacoes`);
    const publicacoes = await respostaPubli.json();

    publicacoes.forEach(publi => {
      const card = criarCard(publi);
      container.appendChild(card);
    });
  } catch (erro) {
    console.error("Erro ao carregar dados:", erro);
  }
};

// Cria cada card de publicação
function criarCard(publicacao) {
  const card = document.createElement("div");
  card.className = "container";

  const usuario = listaUsuarios.find(user => user.id === publicacao.idUsuario);

  // Header
  const header = document.createElement("div");
  header.className = "header";

  const profileIcon = document.createElement("div");
  profileIcon.className = "profile-icon";
  const imgProfile = document.createElement("img");
  imgProfile.src = usuario?.imagemPerfil || "/img/X.png";
  imgProfile.alt = "Ícone de perfil";
  profileIcon.appendChild(imgProfile);

  const userInfo = document.createElement("div");
  userInfo.className = "user-info";

  const userName = document.createElement("div");
  userName.className = "user-name";
  userName.textContent = usuario?.nome || "Usuário";

  const location = document.createElement("div");
  location.className = "location";
  location.textContent = publicacao.local;

  userInfo.appendChild(userName);
  userInfo.appendChild(location);

  header.appendChild(profileIcon);
  header.appendChild(userInfo);

  // Imagem da publicação
  const postImage = document.createElement("div");
  postImage.className = "post-image";
  const img = document.createElement("img");
  img.src = publicacao.imagem;
  img.alt = "Imagem da publicação";
  postImage.appendChild(img);

  // Ações
  const actions = document.createElement("div");
  actions.className = "actions";

  const likeIcon = document.createElement("div");
  likeIcon.className = "action-icon";
  const imgLike = document.createElement("img");
  imgLike.src = "../img/like.png";
  imgLike.alt = "Curtir";
  likeIcon.appendChild(imgLike);
  likeIcon.onclick = () => curtirPublicacao(publicacao.id);

  const commentIcon = document.createElement("div");
  commentIcon.className = "action-icon";
  const imgComment = document.createElement("img");
  imgComment.src = "/img/coment.png";
  imgComment.alt = "Comentar";
  commentIcon.appendChild(imgComment);
  commentIcon.onclick = () => comentarPublicacao(publicacao.id);

  actions.appendChild(likeIcon);
  actions.appendChild(commentIcon);

  // Agrupar tudo no card
  card.appendChild(header);
  card.appendChild(postImage);
  card.appendChild(actions);

  return card;
}

async function curtirPublicacao(idPublicacao) {
  try {
    await fetch(`${API_BASE}/publicacoes/likePublicacao/${idPublicacao}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        idUser: 1, // ID do usuário
      }),
    });
    alert("Publicação curtida!");
  } catch (erro) {
    console.error("Erro ao curtir:", erro);
  }
}

async function comentarPublicacao(idPublicacao) {
    idPublicacaoAtual = idPublicacao;
    abrirModal();
  
    const comentariosDiv = document.getElementById("comentarios-lista");
    comentariosDiv.innerHTML = "";
  
    try {
      const resposta = await fetch(`${API_BASE}/publicacoes/listarPublicacoes`);
      const publicacoes = await resposta.json();
      const publicacao = publicacoes.find(publi => publi.id === idPublicacao);
  
      const comentarios = publicacao.comentarios || [];
  
      comentarios.forEach(com => {
        const usuario = listaUsuarios.find(u => u.id === com.idUser);
  
        const comentarioCard = document.createElement("div");
        comentarioCard.style.display = "flex";
        comentarioCard.style.alignItems = "center";
        comentarioCard.style.marginBottom = "10px";
        comentarioCard.style.gap = "10px";
  
        const img = document.createElement("img");
        img.src = usuario?.imagemPerfil || "/img/X.png";
        img.alt = "foto";
        img.style.width = "32px";
        img.style.height = "32px";
        img.style.borderRadius = "50%";
  
        const textoDiv = document.createElement("div");
  
        const nome = document.createElement("strong");
        nome.textContent = usuario?.nome || "Usuário";
  
        const texto = document.createElement("p");
        texto.textContent = com.descricao;
        texto.style.margin = "2px 0";
  
        textoDiv.appendChild(nome);
        textoDiv.appendChild(texto);
  
        comentarioCard.appendChild(img);
        comentarioCard.appendChild(textoDiv);
  
        comentariosDiv.appendChild(comentarioCard);
      });
    } catch (erro) {
      console.error("Erro ao carregar comentários:", erro);
    }
  }
  

// Enviar novo comentário
async function enviarComentario() {
  const texto = document.getElementById("novo-comentario").value.trim();
  if (!texto) {
    alert("Digite algo antes de enviar.");
    return;
  }

  try {
    await fetch(`${API_BASE}/publicacoes/commentPublicacao/${idPublicacaoAtual}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        idUser: 1,
        descricao: texto,
      }),
    });

    document.getElementById("novo-comentario").value = "";
    comentarPublicacao(idPublicacaoAtual); // recarrega comentários
  } catch (erro) {
    console.error("Erro ao comentar:", erro);
  }
}

// Abrir modal
function abrirModal() {
  document.getElementById("comentario-modal").style.display = "flex";
}

// Fechar modal
function fecharModal() {
  document.getElementById("comentario-modal").style.display = "none";
  document.getElementById("comentarios-lista").innerHTML = "";
  document.getElementById("novo-comentario").value = "";
}
