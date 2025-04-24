'use strict';

window.onload = function() {
    const usuarioIdNoPerfilOnload = localStorage.getItem('usuarioId');
    console.log('ID recuperado (onload) na Tela de Perfil:', usuarioIdNoPerfilOnload);

    if (!usuarioIdNoPerfilOnload) {
        window.location.href = '../Tela_Login/index.html';
        return;
    }

    carregarPerfil();
};

async function carregarPerfil() {
    const usuarioIdParaCarregar = localStorage.getItem('usuarioId');
    console.log('ID antes da requisição:', usuarioIdParaCarregar);
    try {
        const resposta = await fetch(`https://back-spider.vercel.app/user/pesquisarUser/${usuarioIdParaCarregar}`);
        const dados = await resposta.json();

        if (!resposta.ok) throw new Error(dados.mensagem || 'Erro ao carregar perfil');

        document.getElementById('nome').value = dados.nome;
        document.getElementById('email').value = dados.email;
        document.getElementById('apelido').value = dados.nome; // Usando o nome como apelido por enquanto
        document.querySelector('.photo-preview').style.backgroundImage = `url('${dados.imagemPerfil}')`;

    } catch (error) {
        console.error(error);
        alert('Erro ao carregar dados do perfil.');
    }
}

async function salvarAlteracoes() {
    const usuarioIdParaSalvar = localStorage.getItem('usuarioId');
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const imagemPerfil = document.getElementById('foto_perfil').files[0];

    let imagemURL = '';

    if (imagemPerfil) {
        imagemURL = URL.createObjectURL(imagemPerfil);
    } else {
        const preview = document.querySelector('.photo-preview').style.backgroundImage;
        imagemURL = preview.slice(5, -2);
    }

    const corpo = {
        nome,
        email,
        premium: "1",
        imagemPerfil: imagemURL,
        senhaRecuperacao: "Cachorro1234"
    };

    try {
        const resposta = await fetch(`https://back-spider.vercel.app/user/atualizarUser/${usuarioIdParaSalvar}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(corpo)
        });

        const dados = await resposta.json();

        if (!resposta.ok) throw new Error(dados.mensagem || 'Erro ao salvar alterações');

        alert('Perfil atualizado com sucesso!');
        location.reload();

    } catch (error) {
        console.error(error);
        alert('Erro ao salvar alterações.');
    }
}

async function excluirConta() {
    const usuarioIdParaExcluir = localStorage.getItem('usuarioId');
    const confirmar = confirm('Tem certeza que deseja excluir sua conta?');

    if (!confirmar) return;

    try {
        const resposta = await fetch(`https://back-spider.vercel.app/user/deleteUser/${usuarioIdParaExcluir}`, {
            method: 'DELETE'
        });

        if (!resposta.ok) throw new Error('Erro ao excluir conta');

        alert('Conta excluída com sucesso!');
        localStorage.clear();
        window.location.href = '../Tela_Login/index.html';

    } catch (error) {
        console.error(error);
        alert('Erro ao excluir a conta.');
    }
}