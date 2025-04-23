'use strict'

const container = document.createElement('div');
container.classList.add('feed');
document.body.appendChild(container);

let usuarios = [];

async function carregarUsuarios() {
  try {
    const resposta = await fetch('https://back-spider.vercel.app/user/listarUsers');
    usuarios = await resposta.json();
  } catch (erro) {
    console.error("Erro ao carregar usuários:", erro);
  }
}

function criarPublicacao(publi) {
  const usuario = usuarios.find(u => u.id === publi.idUsuario) || {};
  
  const div = document.createElement('div');
  div.classList.add('container');
  
  div.innerHTML = `
    <div class="header">
      <div class="profile-icon">
        <img src="${usuario.imagemPerfil || ''}" alt="User">
      </div>
      <div class="user-info">
        <div class="user-name">${usuario.nome || 'Usuário Desconhecido'}</div>
        <div class="location">${publi.local}</div>
      </div>
    </div>
    <div class="post-image">
      <img src="${publi.imagem}" alt="Imagem publicação">
    </div>
    <div class="actions">
      <div class="action-icon" onclick="curtirPublicacao(${publi.id})">
        <img src="../img/like.png" alt="Curtir">
      </div>
      <div class="action-icon" onclick="abrirModalComentario(${publi.id})">
        <img src="../img/coment.png" alt="Comentar">
      </div>
    </div>
    <p><strong>Descrição:</strong> ${publi.descricao}</p>
    <p><strong>Data:</strong> ${publi.dataPublicacao}</p>
  `;

  container.appendChild(div);
}

async function carregarPublicacoes() {
  try {
    await carregarUsuarios();

    const resposta = await fetch('https://back-spider.vercel.app/publicacoes/listarPublicacoes');
    const publicacoes = await resposta.json();

    publicacoes.forEach(criarPublicacao);
  } catch (erro) {
    console.error("Erro ao carregar dados:", erro);
  }
}

window.onload = carregarPublicacoes;

function curtirPublicacao(idPublicacao) {
  fetch(`https://back-spider.vercel.app/publicacoes/likePublicacao/${idPublicacao}`, {
    method: 'PUT',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idUser: 4 }) // Simulando usuário 4
  }).then(() => alert("Publicação curtida!"));
}

// Comentários
function abrirModalComentario(idPublicacao) {
  const modal = document.getElementById("comentario-modal");
  modal.style.display = "flex";
  modal.dataset.publicacaoId = idPublicacao;
  carregarComentarios(idPublicacao);
}

function fecharModal() {
  document.getElementById("comentario-modal").style.display = "none";
  document.getElementById("comentarios-lista").innerHTML = "";
  document.getElementById("novo-comentario").value = "";
}

function enviarComentario() {
  const id = document.getElementById("comentario-modal").dataset.publicacaoId;
  const texto = document.getElementById("novo-comentario").value;

  if (!texto.trim()) return;

  fetch(`https://back-spider.vercel.app/publicacoes/commentPublicacao/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      idUser: 1,
      descricao: texto
    })
  }).then(() => {
    carregarComentarios(id);
    document.getElementById("novo-comentario").value = "";
  });
}

function carregarComentarios(idPublicacao) {
  const lista = document.getElementById("comentarios-lista");

  lista.innerHTML = `
    <p><strong>Maria:</strong> Muito boa essa!</p>
    <p><strong>João:</strong> Curti bastante!</p>
  `;
}

function abrirModalNovaPublicacao() {
    document.getElementById("modal-nova-publicacao").style.display = "flex";
  }
  
  function fecharModalNovaPublicacao() {
    document.getElementById("modal-nova-publicacao").style.display = "none";
    document.getElementById("input-local").value = "";
    document.getElementById("input-img").value = "";
    document.getElementById("input-descricao").value = "";
  }
  
  function enviarNovaPublicacao() {
    const local = document.getElementById("input-local").value;
    const imagem = document.getElementById("input-img").value;
    const descricao = document.getElementById("input-descricao").value;
  
    if (!local || !imagem || !descricao) {
      alert("Preencha todos os campos.");
      return;
    }
  
    fetch("https://back-spider.vercel.app/publicacoes/criarPublicacao", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        idUsuario: 1, // Simulando um usuário
        local,
        imagem,
        descricao,
        dataPublicacao: new Date().toISOString().slice(0, 10)
      })
    })
    .then(() => {
      fecharModalNovaPublicacao();
      container.innerHTML = "";
      carregarPublicacoes();
    });
  }debugger

  document.getElementById('perfil-btn').addEventListener('click', () => {
    window.location.href = '../Tela_perfil/index.html';
});

  
