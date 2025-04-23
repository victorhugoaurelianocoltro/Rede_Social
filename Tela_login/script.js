'use strict';

async function fazerLogin(email, senha) {
    const url = 'https://back-spider.vercel.app/login';

    const resposta = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, senha })
    });

    const dados = await resposta.json();

    return { sucesso: resposta.ok, dados };
}

async function iniciarLogin() {
    const inputs = document.querySelectorAll('input');
    const email = inputs[0].value;
    const senha = inputs[1].value;

    const { sucesso, dados } = await fazerLogin(email, senha);

    if (!sucesso) {
        alert(dados.mensagem || 'Falha no login');
        return;
    }

    localStorage.setItem('usuarioEmail', email);
    localStorage.setItem('idUsuario', dados.id); // <=== aqui está a chave
    window.location.href = '../Tela_Home/index.html';
}

document.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault();
    iniciarLogin();
});
