// --- INTERFACES PARA TIPAGEM DOS DADOS ---
interface Comentario {
    _id: string; // ID do MongoDB é uma string
    autor: string;
    conteudo: string;
    data: string;
}

interface Postagem {
    _id: string; // ID do MongoDB é uma string
    titulo: string;
    conteudo: string;
    data: string;
    curtidas: number;
    comentarios: Comentario[];
}

// --- FUNÇÕES AUXILIARES E CONSTANTES ---
const baseApiUrl = 'http://localhost:3000/socialifpi/postagem';

function getById(id: string): HTMLElement | null {
    return document.getElementById(id);
}

function showConfirmationModal(message: string, onConfirm: () => void) {
    const modal = getById('confirmationModal');
    const modalMessage = getById('modalMessage');
    const confirmButton = getById('modalConfirmButton');
    const cancelButton = getById('modalCancelButton');

    if (!modal || !modalMessage || !confirmButton || !cancelButton) {
        console.error("Erro: Elementos do modal de confirmação não foram encontrados no HTML!");
        return;
    }

    // Define a mensagem e torna o modal visível
    modalMessage.textContent = message;
    modal.style.display = 'flex';

    // Clona os botões para remover event listeners antigos e evitar cliques múltiplos
    const newConfirmButton = confirmButton.cloneNode(true);
    const newCancelButton = cancelButton.cloneNode(true);
    confirmButton.parentNode?.replaceChild(newConfirmButton, confirmButton);
    cancelButton.parentNode?.replaceChild(newCancelButton, cancelButton);

    // Função para esconder o modal
    const closeModal = () => {
        modal.style.display = 'none';
    };

    // Adiciona o evento de clique ao botão de confirmar
    newConfirmButton.addEventListener('click', () => {
        onConfirm(); // Executa a ação de exclusão
        closeModal();
    });

    // Adiciona o evento de clique ao botão de cancelar
    newCancelButton.addEventListener('click', () => {
        closeModal();
    });
}

// --- FUNÇÕES PRINCIPAIS DA APLICAÇÃO ---

/**
 * Busca todas as postagens da API e as renderiza na página.
 */
async function listarPostagens(): Promise<void> {
    const pesquisaInput = getById('pesquisaInput') as HTMLInputElement | null;

    try {
        const response = await fetch(baseApiUrl);
        if (!response.ok) {
            throw new Error(`Erro na rede: ${response.statusText}`);
        }
        let postagens: Postagem[] = await response.json();

        // Filtra as postagens com base no termo de pesquisa
        const termoPesquisa = pesquisaInput?.value.toLowerCase() || '';
        if (termoPesquisa) {
            postagens = postagens.filter(postagem =>
                postagem.titulo.toLowerCase().includes(termoPesquisa) ||
                postagem.conteudo.toLowerCase().includes(termoPesquisa) ||
                postagem.comentarios.some(comentario =>
                    comentario.autor.toLowerCase().includes(termoPesquisa) ||
                    comentario.conteudo.toLowerCase().includes(termoPesquisa)
                )
            );
        }

        // Pega a div de postagens e renderiza as postagens filtradas
        const postagensElement = getById('postagens');
        if (postagensElement) {
            postagensElement.innerHTML = ''; // Limpa a lista
            if (postagens.length === 0) {
                // Mensagem para quando não há resultados
                postagensElement.innerHTML = '<p>Nenhuma postagem encontrada.</p>';
            } else {
                postagens.forEach(postagem => {
                    postagensElement.appendChild(criarElementoPostagem(postagem));
                });
            }
        }
    } catch (error) {
        console.error("Falha ao buscar postagens:", error);
        const postagensElement = getById('postagens');
        if (postagensElement) {
            postagensElement.innerHTML = "<p>Não foi possível carregar as postagens. Verifique se o backend está rodando.</p>";
        }
    }
}

/**
 * Cria o elemento HTML completo para uma única postagem.
 * @param postagem - O objeto da postagem a ser renderizado.
 * @returns O elemento <article> pronto para ser adicionado ao DOM.
 */
function criarElementoPostagem(postagem: Postagem): HTMLElement {
    const article = document.createElement('article');
    article.id = `post-${postagem._id}`;

    // Conteúdo, data e curtidas
    article.innerHTML = `
            <div class="post-header">
            <h2>${postagem.titulo}</h2>
            </div>
            <p>${postagem.conteudo}</p>
            <p class="data">Publicado em: ${new Date(postagem.data).toLocaleDateString()}</p>
            <div class="comentarios-section">
                <div class="comentarios-header">
                    <h3>Comentários</h3>
                    <button class="botao-toggle-comentarios" aria-label="Mostrar comentários">
                        <i class="fa-solid fa-chevron-down"></i>
                    </button>
                </div>
                <div class="comentarios-conteudo" style="display: none;">
                    <div id="comentarios-list-${postagem._id}">
                    ${postagem.comentarios && postagem.comentarios.length > 0 ? 
                        postagem.comentarios
                        .slice() // cria uma cópia para não alterar o array original
                        .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
                        .map(c => criarHtmlComentario(postagem._id, c)).join('') : 
                        '<p class="sem-comentarios">Ainda não há comentários.</p>'
                    }
                    </div>
                    <form class="form-comentario">
                        <h4>Deixe um comentário</h4>
                        <input type="text" name="autor" placeholder="Seu nome" required />
                        <textarea name="conteudo" placeholder="Escreva seu comentário..." required rows="3"></textarea>
                        <div class="comment-form-actions">
                            <button type="submit">Comentar</button>
                        </div>
                    </form>
                </div>
            </div>
            <div class="post-actions">
                <span class="curtidas-texto" id="curtidas-${postagem._id}">Curtidas: ${postagem.curtidas} ❤️</span>
                <button class="botao-curtir">Curtir 👍</button>
                <a href="editarPost.html?id=${postagem._id}" class="botao-editar-post" title="Editar esta postagem">Editar ✏️</a>
                <button class="botao-excluir-post" title="Excluir esta postagem">Excluir Postagem🗑️</button>
            </div>
    `;
    
    // --- Adicionar Event Listeners ---
    const botaoToggle = article.querySelector('.botao-toggle-comentarios');
    const comentariosConteudo = article.querySelector('.comentarios-conteudo') as HTMLElement;

    if (botaoToggle && comentariosConteudo) {
        botaoToggle.addEventListener('click', () => {
            const isHidden = comentariosConteudo.style.display === 'none';
            comentariosConteudo.style.display = isHidden ? 'block' : 'none';
            const icon = botaoToggle.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-chevron-down', 'fa-chevron-up');
                icon.classList.add(isHidden ? 'fa-chevron-up' : 'fa-chevron-down');
            }
            botaoToggle.setAttribute('aria-label', isHidden ? 'Ocultar comentários' : 'Mostrar comentários');
        });
    }

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
            const autorInput = formComentario.querySelector<HTMLInputElement>('input[name="autor"]');
            const conteudoInput = formComentario.querySelector<HTMLTextAreaElement>('textarea[name="conteudo"]');
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
function criarHtmlComentario(postId: string, comentario: Comentario): string {
    return `
        <div class="comentario" id="comentario-${comentario._id}">
            <p><strong>${comentario.autor}</strong> disse:</p>
            <p>${comentario.conteudo}</p>
            <small class="comentario-data">${new Date(comentario.data).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</small>
            <button class="botao-excluir-comentario" data-comentario-id="${comentario._id}">Excluir</button>
        </div>
    `;
}

/**
 * Envia um novo post para a API.
 */
async function incluirPostagem(): Promise<void> {
    const tituloInput = getById('titulo') as HTMLInputElement | null;
    const conteudoInput = getById('conteudo') as HTMLTextAreaElement | null;

    if (tituloInput && conteudoInput && tituloInput.value.trim() && conteudoInput.value.trim()) {
        const novoPost = {
            titulo: tituloInput.value,
            conteudo: conteudoInput.value,
        };

        await fetch(baseApiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(novoPost)
        });

        await listarPostagens();
        tituloInput.value = '';
        conteudoInput.value = '';
    }
}

/**
 * Remove uma postagem da API e da interface.
 */
async function excluirPostagem(id: string): Promise<void> {
    // Pede confirmação ao usuário antes de uma ação destrutiva
    const onConfirmAction = async () => {
        try {
            const response = await fetch(`${baseApiUrl}/${id}`, { method: 'DELETE' });
            if (!response.ok) {
                throw new Error(`Erro na API ao tentar excluir: ${response.statusText}`);
            }
            const postElement = getById(`post-${id}`);
            if (postElement) {
                postElement.remove();
            }
        } catch (error) {
            console.error("Erro ao excluir a postagem:", error);
            alert("Não foi possível excluir a postagem. Tente novamente.");
        }
    };

    // Chama o modal com a mensagem e a ação a ser executada
    showConfirmationModal(
        "Você tem certeza que deseja excluir esta postagem? Esta ação não pode ser desfeita.",
        onConfirmAction
    );
}

/**
 * Envia um pedido de "curtir" para uma postagem.
 */
async function curtirPostagem(id: string): Promise<void> {
    try {
        const response = await fetch(`${baseApiUrl}/${id}/curtir`, { method: 'POST' });

        if (!response.ok) {
            throw new Error(`Erro ao curtir postagem: ${response.statusText}`);
        }

        const postagemAtualizada: Postagem = await response.json();
        const curtidasElement = getById(`curtidas-${id}`);
        
        if (curtidasElement) {
            curtidasElement.textContent = `Curtidas: ${postagemAtualizada.curtidas} ❤️`;
        }

    } catch (error) {
        console.error("Erro ao curtir postagem:", error);
    }
}

/**
 * Adiciona um comentário a uma postagem.
 */
async function adicionarComentario(postId: string, autor: string, conteudo: string): Promise<void> {
    try {
        const response = await fetch(`${baseApiUrl}/${postId}/comentario`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ autor, conteudo })
        });

        if (!response.ok) {
            throw new Error('Falha ao adicionar o comentário.');
        }

        const postagem: Postagem = await response.json();
        const novoComentario: Comentario = postagem.comentarios[postagem.comentarios.length - 1];

        const comentariosList = getById(`comentarios-list-${postId}`);
        if (comentariosList) {
            // Remove a mensagem "Ainda não há comentários" se ela existir
            const semComentariosMsg = comentariosList.querySelector('.sem-comentarios');
            if (semComentariosMsg) {
                semComentariosMsg.remove();
            }

            // Adiciona o HTML do novo comentário no início da lista
            comentariosList.insertAdjacentHTML('afterbegin', criarHtmlComentario(postId, novoComentario));

            // Adiciona o listener de evento para o botão de excluir do novo comentário
            const novoBotaoExcluir = comentariosList.querySelector(`[data-comentario-id="${novoComentario._id}"]`);
            if (novoBotaoExcluir) {
                novoBotaoExcluir.addEventListener('click', () => excluirComentario(postId, novoComentario._id));
            }
        }

        // Limpa os campos do formulário de comentário
        const form = getById(`post-${postId}`)?.querySelector('.form-comentario');
        if (form) {
            (form.querySelector('input[name="autor"]') as HTMLInputElement).value = '';
            (form.querySelector('textarea[name="conteudo"]') as HTMLTextAreaElement).value = '';
        }

    } catch (error) {
        console.error("Erro ao adicionar comentário:", error);
        alert("Não foi possível adicionar o seu comentário.");
    }
}

/**
 * Exclui um comentário de uma postagem.
 */
async function excluirComentario(postId: string, comentarioId: string): Promise<void> {
    const onConfirmAction = async () => {
        try {
            await fetch(`${baseApiUrl}/${postId}/comentario/${comentarioId}`, {
                method: 'DELETE'
            });
            const comentarioElement = getById(`comentario-${comentarioId}`);
            if (comentarioElement) {
                comentarioElement.remove();
            }
        } catch (error) {
            console.error("Erro ao excluir o comentário:", error);
            alert("Não foi possível excluir o comentário.");
        }
    };
    
    showConfirmationModal(
        "Tem certeza que deseja excluir este comentário?",
        onConfirmAction
    );
}

// --- INICIALIZAÇÃO DA APLICAÇÃO ---

const botaoNovaPostagem = getById("botaoNovaPostagem");
if (botaoNovaPostagem) {
    botaoNovaPostagem.addEventListener('click', incluirPostagem);
}

// Adiciona o listener para o input de pesquisa
const pesquisaInput = getById('pesquisaInput') as HTMLInputElement | null;
if (pesquisaInput) {
    pesquisaInput.addEventListener('input', () => listarPostagens());
}

// Carrega as postagens do feed ao iniciar
listarPostagens();