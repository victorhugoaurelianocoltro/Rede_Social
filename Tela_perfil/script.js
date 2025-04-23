document.addEventListener("DOMContentLoaded", async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
        alert("Usuário não autenticado.");
        return;
    }

    const nomeInput = document.getElementById("nome");
    const emailInput = document.getElementById("email");
    const apelidoInput = document.getElementById("apelido"); // Por enquanto opcional
    const fotoPerfil = document.querySelector(".photo-preview");
    const fotoInput = document.getElementById("foto_perfil");

    try {
        const response = await fetch(`https://back-spider.vercel.app/user/pesquisarUser/${userId}`);
        const data = await response.json();

        nomeInput.value = data.nome;
        emailInput.value = data.email;
        apelidoInput.value = ""; // se quiser salvar o apelido depois, adicione no backend
        fotoPerfil.style.backgroundImage = `url(${data.imagemPerfil})`;

        // Atualizar imagem ao escolher novo arquivo
        fotoInput.addEventListener("change", (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    fotoPerfil.style.backgroundImage = `url(${e.target.result})`;
                };
                reader.readAsDataURL(file);
            }
        });

        // Botão de salvar
        document.querySelector(".save").addEventListener("click", async () => {
            const updatedUser = {
                nome: nomeInput.value,
                email: emailInput.value,
                premium: "1",
                imagemPerfil: fotoPerfil.style.backgroundImage.slice(5, -2), // tira o url("...") da string
                senhaRecuperacao: data.senhaRecuperacao
            };

            await fetch(`https://back-spider.vercel.app/user/atualizarUser/${userId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedUser)
            });

            alert("Alterações salvas com sucesso!");
        });

        // Botão de deletar
        document.querySelector(".delete").addEventListener("click", async () => {
            const confirmDelete = confirm("Tem certeza que deseja excluir sua conta?");
            if (confirmDelete) {
                await fetch(`https://back-spider.vercel.app/user/deleteUser/${userId}`, {
                    method: "DELETE"
                });
                alert("Conta excluída.");
                window.location.href = "login.html"; // ou tela inicial
            }
        });

    } catch (error) {
        console.error("Erro ao buscar usuário:", error);
        alert("Erro ao carregar dados do usuário.");
    }
});
