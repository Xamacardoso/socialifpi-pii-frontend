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
        const postAtualizado = {
            titulo: tituloInput.value,
            conteudo: conteudoInput.value,
        };
        try {
            const response = yield fetch(`${apiUrl}/${postId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(postAtualizado),
            });
            if (!response.ok) {
                throw new Error('Falha ao atualizar a postagem.');
            }
            alert("Postagem atualizada com sucesso!");
            window.location.href = 'index.html'; // Redireciona para a página principal
        }
        catch (error) {
            console.error("Erro ao atualizar postagem:", error);
            alert("Erro ao salvar as alterações.");
        }
    });
}
// Adiciona os event listeners quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    carregarPostagem();
    if (formEditar) {
        formEditar.addEventListener('submit', atualizarPostagem);
    }
});
