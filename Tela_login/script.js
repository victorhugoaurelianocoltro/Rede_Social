'use strict';

const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    if (!email || !senha) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    const corpoLogin = {
        email,
        senha
    };

    try {
        const responseLogin = await fetch('https://back-spider.vercel.app/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(corpoLogin)
        });

        if (!responseLogin.ok) {
            const errorData = await responseLogin.json();
            throw new Error(errorData.message || 'Erro ao fazer login');
        }

        console.log('Login realizado com sucesso. Buscando lista de usuários...');

        try {
            const responseUsers = await fetch('https://back-spider.vercel.app/user/listarUsers');

            if (!responseUsers.ok) {
                const errorDataUsers = await responseUsers.json();
                throw new Error(errorDataUsers.message || 'Erro ao buscar lista de usuários');
            }

            const users = await responseUsers.json();
            console.log('Lista de usuários recebida:', users);
            console.log('Buscando usuário com email:', email); // LOG ADICIONADO

            const loggedInUser = users.find(user => user.email === email);

            if (loggedInUser && loggedInUser.id) {
                console.log('Usuário encontrado:', loggedInUser); // LOG ADICIONADO
                localStorage.setItem('usuarioId', loggedInUser.id);
                localStorage.setItem('usuarioNome', loggedInUser.nome);
                localStorage.setItem('usuarioEmail', loggedInUser.email);
                localStorage.setItem('usuarioImagemPerfil', loggedInUser.imagemPerfil);
                console.log('Dados do usuário armazenados no localStorage:', localStorage);
                alert('Login realizado com sucesso!');
                window.location.href = '../Tela_Home/index.html';
            } else {
                console.error('Usuário não encontrado na lista ou ID ausente.');
                alert('Erro ao fazer login: usuário não encontrado ou dados incompletos.');
            }

        } catch (error) {
            console.error('Erro ao buscar lista de usuários:', error);
            alert('Erro ao obter informações do usuário após o login.');
        }

    } catch (error) {
        alert(`Erro ao fazer login: ${error.message}`);
    }
});