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
// --- FUNÇÕES AUXILIARES E CONSTANTES ---
const apiUrl = 'http://localhost:3000/socialifpi/postagem';
function getById(id) {
    return document.getElementById(id);
}
// --- FUNÇÕES PRINCIPAIS DA APLICAÇÃO ---
/**
 * Busca todas as postagens da API e as renderiza na página.
 */
function listarPostagens() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(apiUrl);
            if (!response.ok) {
                throw new Error(`Erro na rede: ${response.statusText}`);
            }
            const postagens = yield response.json();
            const postagensElement = getById('postagens');
            if (postagensElement) {
                postagensElement.innerHTML = ''; // Limpa a lista antes de recarregar
                postagens.forEach(postagem => {
                    postagensElement.appendChild(criarElementoPostagem(postagem));
                });
            }
        }
        catch (error) {
            console.error("Falha ao buscar postagens:", error);
            const postagensElement = getById('postagens');
            if (postagensElement) {
                postagensElement.innerHTML = "<p>Não foi possível carregar as postagens. Verifique se o backend está rodando.</p>";
            }
        }
    });
}
/**
 * Cria o elemento HTML completo para uma única postagem.
 * @param postagem - O objeto da postagem a ser renderizado.
 * @returns O elemento <article> pronto para ser adicionado ao DOM.
 */
function criarElementoPostagem(postagem) {
    const article = document.createElement('article');
    article.id = `post-${postagem._id}`;
    // Conteúdo, data e curtidas
    article.innerHTML = `
            <div class="post-header">
            <h2>${postagem.titulo}</h2>
            </div>
            <p>${postagem.conteudo}</p>
            <p class="data">Publicado em: ${new Date(postagem.data).toLocaleDateString()}</p>
            <div class="curtidas-container">
            <span id="curtidas-${postagem._id}">Curtidas: ${postagem.curtidas}</span>
            <button class="botao-curtir">Curtir 👍</button>
            </div>
            <div class="comentarios-section">
            <h3>Comentários</h3>
            <div id="comentarios-list-${postagem._id}">
            ${postagem.comentarios && postagem.comentarios.length > 0 ?
        postagem.comentarios.map(c => criarHtmlComentario(postagem._id, c)).join('') :
        '<p class="sem-comentarios">Ainda não há comentários.</p>'}
            </div>
            <form class="form-comentario">
            <h4>Deixe um comentário</h4>
            <input type="text" name="autor" placeholder="Seu nome" required />
            <textarea name="conteudo" placeholder="Escreva seu comentário..." required rows="3"></textarea>
            <button type="submit">Comentar</button>
            </form>
            </div>
            <button class="botao-excluir-post" title="Excluir esta postagem">Excluir Postagem 🗑️</button>
    `;
    // --- Adicionar Event Listeners ---
    const botaoExcluirPost = article.querySelector('.botao-excluir-post');
    if (botaoExcluirPost) {
        botaoExcluirPost.addEventListener('click', () => excluirPostagem(postagem._id));
    }
    const botaoCurtir = article.querySelector('.botao-curtir');
    if (botaoCurtir) {
        botaoCurtir.addEventListener('click', () => curtirPostagem(postagem._id));
    }
    const formComentario = article.querySelector('.form-comentario');
    if (formComentario) {
        formComentario.addEventListener('submit', (e) => {
            e.preventDefault();
            const autorInput = formComentario.querySelector('input[name="autor"]');
            const conteudoInput = formComentario.querySelector('textarea[name="conteudo"]');
            if (autorInput && conteudoInput && autorInput.value && conteudoInput.value) {
                adicionarComentario(postagem._id, autorInput.value, conteudoInput.value);
                autorInput.value = '';
                conteudoInput.value = '';
            }
        });
    }
    // Adicionar listeners para os botões de excluir dos comentários já existentes
    const botoesExcluir = article.querySelectorAll('.botao-excluir-comentario');
    botoesExcluir.forEach(botao => {
        const comentarioId = botao.getAttribute('data-comentario-id');
        if (comentarioId) {
            botao.addEventListener('click', () => excluirComentario(postagem._id, comentarioId));
        }
    });
    return article;
}
/**
 * Cria a string HTML para um único comentário.
 */
function criarHtmlComentario(postId, comentario) {
    return `
        <div class="comentario" id="comentario-${comentario._id}">
            <p><strong>${comentario.autor}</strong> disse:</p>
            <p>${comentario.conteudo}</p>
            <button class="botao-excluir-comentario" data-comentario-id="${comentario._id}">Excluir</button>
        </div>
    `;
}
/**
 * Envia um novo post para a API.
 */
function incluirPostagem() {
    return __awaiter(this, void 0, void 0, function* () {
        const tituloInput = getById('titulo');
        const conteudoInput = getById('conteudo');
        if (tituloInput && conteudoInput && tituloInput.value.trim() && conteudoInput.value.trim()) {
            const novoPost = {
                titulo: tituloInput.value,
                conteudo: conteudoInput.value,
            };
            yield fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(novoPost)
            });
            yield listarPostagens();
            tituloInput.value = '';
            conteudoInput.value = '';
        }
    });
}
/**
 * Remove uma postagem da API e da interface.
 */
function excluirPostagem(id) {
    return __awaiter(this, void 0, void 0, function* () {
        // Pede confirmação ao usuário antes de uma ação destrutiva
        if (confirm("Você tem certeza que deseja excluir esta postagem? Esta ação não pode ser desfeita.")) {
            try {
                const response = yield fetch(`${apiUrl}/${id}`, {
                    method: 'DELETE'
                });
                if (!response.ok) {
                    throw new Error(`Erro na API ao tentar excluir: ${response.statusText}`);
                }
                // Remove o elemento da postagem da tela para atualizar a interface
                const postElement = getById(`post-${id}`);
                if (postElement) {
                    postElement.remove();
                }
            }
            catch (error) {
                console.error("Erro ao excluir a postagem:", error);
                alert("Não foi possível excluir a postagem. Tente novamente.");
            }
        }
    });
}
/**
 * Envia um pedido de "curtir" para uma postagem.
 */
function curtirPostagem(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(`${apiUrl}/${id}/curtir`, { method: 'POST' });
            if (!response.ok) {
                throw new Error(`Erro ao curtir postagem: ${response.statusText}`);
            }
            const postagemAtualizada = yield response.json();
            const curtidasElement = getById(`curtidas-${id}`);
            if (curtidasElement) {
                curtidasElement.textContent = `Curtidas: ${postagemAtualizada.curtidas}`;
            }
        }
        catch (error) {
            console.error("Erro ao curtir postagem:", error);
        }
    });
}
/**
 * Adiciona um comentário a uma postagem.
 */
function adicionarComentario(postId, autor, conteudo) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(`${apiUrl}/${postId}/comentario`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ autor, conteudo })
        });
        // Após adicionar, simplesmente recarrega todo o feed para simplicidade
        yield listarPostagens();
    });
}
/**
 * Exclui um comentário de uma postagem.
 */
function excluirComentario(postId, comentarioId) {
    return __awaiter(this, void 0, void 0, function* () {
        if (confirm("Tem certeza que deseja excluir este comentário?")) {
            yield fetch(`${apiUrl}/${postId}/comentario/${comentarioId}`, {
                method: 'DELETE'
            });
            const comentarioElement = getById(`comentario-${comentarioId}`);
            if (comentarioElement) {
                comentarioElement.remove();
            }
        }
    });
}
// --- INICIALIZAÇÃO DA APLICAÇÃO ---
const botaoNovaPostagem = getById("botaoNovaPostagem");
if (botaoNovaPostagem) {
    botaoNovaPostagem.addEventListener('click', incluirPostagem);
}
// Carrega as postagens do feed ao iniciar
listarPostagens();
