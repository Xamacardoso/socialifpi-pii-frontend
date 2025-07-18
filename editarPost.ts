const apiUrl = 'http://localhost:3000/socialifpi/postagem';

const tituloInput = document.getElementById('titulo') as HTMLInputElement;
const conteudoInput = document.getElementById('conteudo') as HTMLTextAreaElement;
const formEditar = document.getElementById('formEditar');

// Pega o ID da postagem da URL
const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get('id');

/**
 * Exibe o modal de confirmacao na hora de salvar
 */
function showSaveModal(message: string, onConfirm: () => void) {
    const modal = document.getElementById('confirmationModal');
    const modalMessage = document.getElementById('modalMessage');
    const confirmButton = document.getElementById('modalConfirmButton');
    const cancelButton = document.getElementById('modalCancelButton');

    if (!modal || !modalMessage || !confirmButton || !cancelButton) {
        console.error("Erro: Elementos do modal de confirmação não foram encontrados no HTML!");
        return;
    }

    modalMessage.textContent = message;
    modal.style.display = 'flex';

    const newConfirmButton = confirmButton.cloneNode(true);
    const newCancelButton = cancelButton.cloneNode(true);
    confirmButton.parentNode?.replaceChild(newConfirmButton, confirmButton);
    cancelButton.parentNode?.replaceChild(newCancelButton, cancelButton);

    const closeModal = () => {
        modal.style.display = 'none';
    };

    newConfirmButton.addEventListener('click', () => {
        onConfirm();
        closeModal();
    });

    newCancelButton.addEventListener('click', () => {
        closeModal();
    });
}

/**
 * Carrega os dados da postagem no formulário
 */
async function carregarPostagem() {
    if (!postId) {
        alert("ID da postagem não fornecido!");
        window.location.href = 'index.html'; // Volta para a página principal
        return;
    }

    try {
        const response = await fetch(`${apiUrl}/${postId}`);
        if (!response.ok) {
            throw new Error('Não foi possível carregar a postagem.');
        }
        const post = await response.json();
        tituloInput.value = post.titulo;
        conteudoInput.value = post.conteudo;
    } catch (error) {
        console.error("Erro ao carregar postagem:", error);
        alert("Erro ao carregar os dados da postagem.");
        window.location.href = 'index.html'; // Redireciona para a página principal
        return;
    }
}

/**
 * Atualiza a postagem com os novos dados
 */
async function atualizarPostagem(event: Event) {
    event.preventDefault(); // Impede o recarregamento da página

    if (!postId) return;

    const onConfirmAction = async () => {
        const postAtualizado = {
            titulo: tituloInput.value,
            conteudo: conteudoInput.value,
        };

        try {
            const response = await fetch(`${apiUrl}/${postId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(postAtualizado),
            });

            if (!response.ok) {
                throw new Error('Falha ao atualizar a postagem.');
            }

            // O alerta foi removido daqui
            window.location.href = 'index.html';
        } catch (error) {
            console.error("Erro ao atualizar postagem:", error);
            alert("Erro ao salvar as alterações.");
        }
    };

    showSaveModal("Você tem certeza que deseja salvar as alterações?", onConfirmAction);
}

// Adiciona os event listeners quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    carregarPostagem();
    if (formEditar) {
        formEditar.addEventListener('submit', atualizarPostagem);
    }
});