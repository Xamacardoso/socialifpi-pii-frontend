"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const apiUrl = 'http://localhost:3000/socialifpi/postagem';
const tituloInput = document.getElementById('titulo');
const conteudoInput = document.getElementById('conteudo');
const formEditar = document.getElementById('formEditar');
// Pega o ID da postagem da URL
const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get('id');
/**
 * Exibe o modal de confirmacao na hora de salvar
 */
function showSaveModal(message, onConfirm) {
    var _a, _b;
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
    (_a = confirmButton.parentNode) === null || _a === void 0 ? void 0 : _a.replaceChild(newConfirmButton, confirmButton);
    (_b = cancelButton.parentNode) === null || _b === void 0 ? void 0 : _b.replaceChild(newCancelButton, cancelButton);
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
function carregarPostagem() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!postId) {
            alert("ID da postagem não fornecido!");
            window.location.href = 'index.html'; // Volta para a página principal
            return;
        }
        try {
            const response = yield fetch(`${apiUrl}/${postId}`);
            if (!response.ok) {
                throw new Error('Não foi possível carregar a postagem.');
            }
            const post = yield response.json();
            tituloInput.value = post.titulo;
            conteudoInput.value = post.conteudo;
        }
        catch (error) {
            console.error("Erro ao carregar postagem:", error);
            alert("Erro ao carregar os dados da postagem.");
            window.location.href = 'index.html'; // Redireciona para a página principal
            return;
        }
    });
}
/**
 * Atualiza a postagem com os novos dados
 */
function atualizarPostagem(event) {
    return __awaiter(this, void 0, void 0, function* () {
        event.preventDefault(); // Impede o recarregamento da página
        if (!postId)
            return;
        const onConfirmAction = () => __awaiter(this, void 0, void 0, function* () {
            const postAtualizado = {
                titulo: tituloInput.value,
                conteudo: conteudoInput.value,
            };
            try {
                const response = yield fetch(`${apiUrl}/${postId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(postAtualizado),
                });
                if (!response.ok) {
                    throw new Error('Falha ao atualizar a postagem.');
                }
                // O alerta foi removido daqui
                window.location.href = 'index.html';
            }
            catch (error) {
                console.error("Erro ao atualizar postagem:", error);
                alert("Erro ao salvar as alterações.");
            }
        });
        showSaveModal("Você tem certeza que deseja salvar as alterações?", onConfirmAction);
    });
}
// Adiciona os event listeners quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    carregarPostagem();
    if (formEditar) {
        formEditar.addEventListener('submit', atualizarPostagem);
    }
});
