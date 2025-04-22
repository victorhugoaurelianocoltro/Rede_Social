'use strict';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const voltarBtn = document.querySelector('.voltar');
    const cadastrarBtn = document.querySelector('.cadastrar');

    cadastrarBtn.addEventListener('click', async (event) => {
        event.preventDefault();

        const inputs = form.querySelectorAll('input');
        const nome = inputs[0].value;
        const email = inputs[1].value;
        const senhaRecuperacao = inputs[2].value; // usaremos data como senha de recuperação
        const senha = inputs[3].value;
        const confirmarSenha = inputs[4].value;

        if (!nome || !email || !senha || !confirmarSenha) {
            alert('Preencha todos os campos.');
            return;
        }

        if (senha !== confirmarSenha) {
            alert('As senhas não coincidem.');
            return;
        }

        const corpo = {
            nome,
            email,
            senha,
            premium: "0",
            imagemPerfil: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
            senhaRecuperacao
        };

        try {
            const response = await fetch('https://back-spider.vercel.app/user/cadastrarUser', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(corpo)
            });

            if (!response.ok) throw new Error('Erro ao cadastrar usuário');

            alert('Cadastro realizado com sucesso!');
            window.location.href = '../Tela_login/index.html';
        } catch (err) {
            alert('Erro ao cadastrar. Verifique os dados e tente novamente.');
        }
    });

    voltarBtn.addEventListener('click', (event) => {
        event.preventDefault();
        window.location.href = '../Tela_login/index.html';
    });
});
