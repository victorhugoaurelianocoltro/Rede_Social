'use strict';



const container = document.createElement('div');
container.classList.add('feed');
document.body.appendChild(container);

const usuarioIdNaHome = localStorage.getItem('usuarioId');
console.log('Valor de usuarioId na Tela Home:', usuarioIdNaHome);

let usuarios = [];
let publicacoesCarregadas = [];

async function carregarUsuarios() {
    try {
        const resposta = await fetch('https://back-spider.vercel.app/user/listarUsers');
        const data = await resposta.json();
        usuarios = Array.isArray(data) ? data : [data];
    } catch (erro) {
        console.error("Erro ao carregar usuários:", erro);
    }
}

function criarPublicacao(publi) {
    const usuarioPostador = usuarios.find(u => u.id === publi.idUsuario) || { nome: 'Usuário Desconhecido', imagemPerfil: '' };
    console.log('Usuário do post:', usuarioPostador);
    const div = document.createElement('div');
    div.classList.add('container');

    let comentariosHTML = '';
    console.log('Comentários da publicação:', publi.comentarios);
    if (publi.comentarios && publi.comentarios.length > 0) {
        comentariosHTML = publi.comentarios.map(comentario => {
            const usuarioComentador = usuarios.find(u => u.id === comentario.idUsuario) || { nome: 'Usuário Desconhecido' };
            console.log('Usuário do comentário:', usuarioComentador, 'Comentário:', comentario);
            return `
                <div class="comentario">
                    <p><strong>${usuarioComentador.nome}:</strong> ${comentario.descricao}</p>
                </div>
            `;
        }).join('');
    } else {
        comentariosHTML = '<p>Sem comentários ainda.</p>';
    }

    let curtido = publi.curtidas && publi.curtidas.some(like => like.idUsuario === parseInt(localStorage.getItem('usuarioId')));
    const likeSrc = curtido ? '../img/like-ativo.png' : '../img/like.png';

    div.innerHTML = `
        <div class="header">
            <div class="profile-icon">
                <img src="${usuarioPostador.imagemPerfil || ''}" alt="User">
            </div>
            <div class="user-info">
                <div class="user-name">${usuarioPostador.nome}</div>
                <div class="location">${publi.local}</div>
            </div>
        </div>
        <div class="post-image">
            <img src="${publi.imagem}" alt="Imagem publicação">
        </div>
        <div class="actions">
            <div class="action-icon like-btn" data-publicacao-id="${publi.id}">
                <img src="${likeSrc}" alt="Curtir">
            </div>
            <div class="action-icon comment-btn" data-publicacao-id="${publi.id}">
                <img src="../img/coment.png" alt="Comentar">
            </div>
        </div>
        <p><strong>Descrição:</strong> ${publi.descricao}</p>
        <p><strong>Data:</strong> ${publi.dataPublicacao}</p>
        <div class="comentarios-preview" data-publicacao-id="${publi.id}" style="cursor: pointer;">
            ${comentariosHTML.substring(0, 200)} ${publi.comentarios && publi.comentarios.length > 2 && comentariosHTML.length > 200 ? '... Ver mais' : ''}
        </div>
    `;

    container.appendChild(div);

    div.querySelector('.like-btn').addEventListener('click', () => curtirPublicacao(publi.id));
    div.querySelector('.comment-btn').addEventListener('click', () => abrirModalComentario(publi.id));
    div.querySelector('.comentarios-preview').addEventListener('click', () => abrirModalComentario(publi.id));
}

async function carregarPublicacoes() {
    try {
        await carregarUsuarios();
        const resposta = await fetch('https://back-spider.vercel.app/publicacoes/listarPublicacoes');
        const data = await resposta.json();
        publicacoesCarregadas = Array.isArray(data) ? data : [data];
        container.innerHTML = '';
        publicacoesCarregadas.forEach(criarPublicacao);
    } catch (erro) {
        console.error("Erro ao carregar dados:", erro);
    }
}

window.onload = carregarPublicacoes;

async function curtirPublicacao(idPublicacao) {
    const userId = localStorage.getItem('usuarioId');
    if (!userId) return alert('Você precisa estar logado para curtir.');
    try {
        const resposta = await fetch(`https://back-spider.vercel.app/publicacoes/likePublicacao/${idPublicacao}`, {
            method: 'PUT',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idUser: parseInt(userId) })
        });
        if (resposta.ok) {
            carregarPublicacoes();
        } else {
            const data = await resposta.json();
            alert(data.mensagem || 'Erro ao curtir.');
        }
    } catch (error) {
        console.error("Erro ao curtir:", error);
        alert('Erro ao curtir.');
    }
}

let publicacaoIdComentariosAberto;

function abrirModalComentario(idPublicacao) {
    publicacaoIdComentariosAberto = idPublicacao;
    const modal = document.getElementById("comentario-modal");
    modal.style.display = "flex";
    const publicacao = publicacoesCarregadas.find(p => p.id === idPublicacao);
    const listaComentarios = document.getElementById("comentarios-lista");
    listaComentarios.innerHTML = '<p>Carregando comentários...</p>';

    if (publicacao && publicacao.comentarios && publicacao.comentarios.length > 0) {
        listaComentarios.innerHTML = publicacao.comentarios.map(comentario => {
            const usuarioComentador = usuarios.find(u => u.id === comentario.idUsuario) || { nome: 'Usuário Desconhecido' };
            return `
                <div class="comentario">
                    <p><strong>${usuarioComentador.nome}:</strong> ${comentario.descricao}</p>
                </div>
            `;
        }).join('');
    } else {
        listaComentarios.innerHTML = '<p>Sem comentários.</p>';
    }
}

function fecharModal() {
    document.getElementById("comentario-modal").style.display = "none";
    document.getElementById("comentarios-lista").innerHTML = "";
    document.getElementById("novo-comentario").value = "";
    publicacaoIdComentariosAberto = null;
}

async function enviarComentario() {
    if (!publicacaoIdComentariosAberto) return;
    const texto = document.getElementById("novo-comentario").value;
    const userId = localStorage.getItem('usuarioId');
    if (!userId) return alert('Você precisa estar logado para comentar.');
    if (!texto.trim()) return;
    try {
        const resposta = await fetch(`https://back-spider.vercel.app/publicacoes/commentPublicacao/${publicacaoIdComentariosAberto}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                idUser: parseInt(userId),
                descricao: texto
            })
        });
        if (resposta.ok) {
            document.getElementById("novo-comentario").value = "";
            // Não precisa recarregar os comentários individualmente aqui,
            // carregarPublicacoes() já atualiza a visualização rápida.
            carregarPublicacoes();
        } else {
            const data = await resposta.json();
            alert(data.mensagem || 'Erro ao enviar comentário.');
        }
    } catch (error) {
        console.error("Erro ao enviar comentário:", error);
        alert('Erro ao enviar comentário.');
    }
}

function abrirModalNovaPublicacao() {
    document.getElementById("modal-nova-publicacao").style.display = "flex";
}

async function enviarNovaPublicacao() {
    const local = document.getElementById("input-local").value;
    const imagem = document.getElementById("input-img").value;
    const descricao = document.getElementById("input-descricao").value;
    const userId = localStorage.getItem('usuarioId');
    if (!userId) return alert("Você precisa estar logado para publicar.");
    if (!local || !imagem || !descricao) return alert("Preencha todos os campos.");
    try {
        const resposta = await fetch("https://back-spider.vercel.app/publicacoes/cadastrarPublicacao", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                descricao: descricao,
                dataPublicacao: new Date().toISOString().slice(0, 10),
                imagem: imagem,
                local: local,
                idUsuario: parseInt(userId)
            })
        });
        if (resposta.ok) {
            fecharModalNovaPublicacao();
            carregarPublicacoes();
        } else {
            const data = await resposta.json();
            alert(data.mensagem || 'Erro ao criar publicação.');
        }
    } catch (error) {
        console.error("Erro ao criar publicação:", error);
        alert('Erro ao criar publicação.');
    } finally {
        document.getElementById("modal-nova-publicacao").style.display = "none";
        document.getElementById("input-local").value = "";
        document.getElementById("input-img").value = "";
        document.getElementById("input-descricao").value = "";
    }
}

function fecharModalNovaPublicacao() {
    document.getElementById("modal-nova-publicacao").style.display = "none";
    document.getElementById("input-local").value = "";
    document.getElementById("input-img").value = "";
    document.getElementById("input-descricao").value = "";
}

document.getElementById('perfil-btn').addEventListener('click', () => {
    const usuarioIdParaPerfil = localStorage.getItem('usuarioId');
    console.log('ID no localStorage antes de ir para o Perfil:', usuarioIdParaPerfil);
    if (usuarioIdParaPerfil) {
        window.location.href = '../Tela_perfil/index.html';
    } else {
        alert('Sua sessão expirou. Redirecionando para a tela de login.');
        window.location.href = '../Tela_Login/index.html';
    }
});
