'use strict';

document.addEventListener('DOMContentLoaded', () => {
    const recuperarSenhaBtn = document.getElementById('recuperarSenhaBtn');
    const emailInput = document.getElementById('email');
    const wordKeyInput = document.getElementById('wordKey');
    const mensagemElement = document.getElementById('mensagem');
    const voltarLoginBtn = document.getElementById('voltarLoginBtn'); // Novo botão

    recuperarSenhaBtn.addEventListener('click', async () => {
        const email = emailInput.value;
        const wordKey = wordKeyInput.value;

        if (!email || !wordKey) {
            mensagemElement.textContent = 'Por favor, preencha todos os campos.';
            mensagemElement.style.color = 'red';
            return;
        }

        const corpo = {
            email: email,
            wordKey: wordKey
        };

        try {
            const response = await fetch('https://back-spider.vercel.app/user/RememberPassword', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(corpo)
            });

            const data = await response.json();

            if (response.ok) {
                if (data.senha) {
                    mensagemElement.textContent = `Sua senha é: ${data.senha}`;
                    mensagemElement.style.color = 'green';
                } else {
                    mensagemElement.textContent = 'Verificação bem-sucedida, mas a senha não foi retornada.';
                    mensagemElement.style.color = 'orange';
                }
            } else {
                mensagemElement.textContent = data.message || 'Erro ao verificar os dados. Verifique seu email e palavra-chave.';
                mensagemElement.style.color = 'red';
            }

        } catch (error) {
            console.error('Erro ao enviar solicitação de recuperação de senha:', error);
            mensagemElement.textContent = 'Erro inesperado ao tentar recuperar a senha. Tente novamente mais tarde.';
            mensagemElement.style.color = 'red';
        }
    });

    // Event listener para o botão "Voltar ao Login"
    voltarLoginBtn.addEventListener('click', () => {
        window.location.href = '../Tela_login/index.html';
    });
});