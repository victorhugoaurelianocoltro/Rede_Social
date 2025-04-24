'use strict';

console.log('Tela de Login carregada.');

const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    if (!email || !senha) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    const corpo = {
        email,
        senha
    };

    try {
        const response = await fetch('https://back-spider.vercel.app/user/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(corpo)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erro ao fazer login');
        }

        const userData = await response.json();
        console.log('Dados do usuário recebidos no login:', userData); // VERIFIQUE ESTE LOG

        // Armazenar informações do usuário no localStorage
        localStorage.setItem('usuarioId', userData.id);
        localStorage.setItem('usuarioNome', userData.nome);
        localStorage.setItem('usuarioEmail', userData.email);
        localStorage.setItem('usuarioImagemPerfil', userData.imagemPerfil);
        // Adicione outras informações que você precisar

        console.log('usuarioId armazenado no localStorage:', localStorage.getItem('usuarioId')); // VERIFIQUE ESTE LOG

        alert('Login realizado com sucesso!');
        window.location.href = '../home/index.html';

    } catch (error) {
        alert(`Erro ao fazer login: ${error.message}`);
    }
});