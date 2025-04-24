'use strict';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('cadastroForm');
    const voltarBtn = document.querySelector('.voltar');
    const cadastrarBtn = document.querySelector('.cadastrar');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const nome = document.getElementById('nomeCompleto').value;
        const email = document.getElementById('email').value;
        const senha = document.getElementById('novaSenha').value;
        const confirmarSenha = document.getElementById('confirmarSenha').value;
        const senhaRecuperacao = document.getElementById('senhaRecuperacao').value; 
        const premium = document.getElementById('premium').value;
        const imagemPerfil = document.getElementById('imagemPerfil').value || "https://cdn-icons-png.flaticon.com/512/149/149071.png"; // Valor padrão se não for fornecido

        if (!nome || !email || !senha || !confirmarSenha || !senhaRecuperacao) {
            alert('Preencha todos os campos obrigatórios.');
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
            premium,
            imagemPerfil,
            senhaRecuperacao
        };

        try {
            const response = await fetch('https://back-spider.vercel.app/user/cadastrarUser', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(corpo)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erro ao cadastrar usuário');
            }

            alert('Cadastro realizado com sucesso!');
            window.location.href = '../Tela_login/index.html';
        } catch (err) {
            alert(`Erro ao cadastrar: ${err.message}. Verifique os dados e tente novamente.`);
        }
    });

    voltarBtn.addEventListener('click', () => {
        window.location.href = '../Tela_login/index.html';
    });
});