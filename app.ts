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
const apiUrl = 'http://localhost:3000/socialifpi/postagem';

function getById(id: string): HTMLElement | null {
    return document.getElementById(id);
}

// --- FUNÇÕES PRINCIPAIS DA APLICAÇÃO ---

/**
 * Busca todas as postagens da API e as renderiza na página.
 */
async function listarPostagens(): Promise<void> {

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`Erro na rede: ${response.statusText}`);
        }
        const postagens: Postagem[] = await response.json();

        const postagensElement = getById('postagens');
        if (postagensElement) {
            postagensElement.innerHTML = ''; // Limpa a lista antes de recarregar
            postagens.forEach(postagem => {
                postagensElement.appendChild(criarElementoPostagem(postagem));
            });
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
        <h2>${postagem.titulo}</h2>
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
                    '<p class="sem-comentarios">Ainda não há comentários.</p>'
                }
            </div>
            <form class="form-comentario">
                <h4>Deixe um comentário</h4>
                <input type="text" name="autor" placeholder="Seu nome" required />
                <textarea name="conteudo" placeholder="Escreva seu comentário..." required rows="3"></textarea>
                <button type="submit">Comentar</button>
            </form>
        </div>
    `;
    
    // --- Adicionar Event Listeners ---
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
    const botoesExcluir = article.querySelectorAll('.botao-excluir');
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
            <button class="botao-excluir" data-comentario-id="${comentario._id}">Excluir</button>
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

        await fetch(apiUrl, {
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
 * Envia um pedido de "curtir" para uma postagem.
 */
async function curtirPostagem(id: string): Promise<void> {
    try {
        const response = await fetch(`${apiUrl}/${id}/curtir`, { method: 'POST' });

        if (!response.ok) {
            throw new Error(`Erro ao curtir postagem: ${response.statusText}`);
        }

        const postagemAtualizada: Postagem = await response.json();
        const curtidasElement = getById(`curtidas-${id}`);
        
        if (curtidasElement) {
            curtidasElement.textContent = `Curtidas: ${postagemAtualizada.curtidas}`;
        }

    } catch (error) {
        console.error("Erro ao curtir postagem:", error);
    }
}

/**
 * Adiciona um comentário a uma postagem.
 */
async function adicionarComentario(postId: string, autor: string, conteudo: string): Promise<void> {
    const response = await fetch(`${apiUrl}/${postId}/comentario`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ autor, conteudo })
    });
    
    // Após adicionar, simplesmente recarrega todo o feed para simplicidade
    await listarPostagens();
}

/**
 * Exclui um comentário de uma postagem.
 */
async function excluirComentario(postId: string, comentarioId: string): Promise<void> {
    if (confirm("Tem certeza que deseja excluir este comentário?")) {
        await fetch(`${apiUrl}/${postId}/comentario/${comentarioId}`, {
            method: 'DELETE'
        });
        const comentarioElement = getById(`comentario-${comentarioId}`);
        if (comentarioElement) {
            comentarioElement.remove();
        }
    }
}

// --- INICIALIZAÇÃO DA APLICAÇÃO ---

const botaoNovaPostagem = getById("botaoNovaPostagem");
if (botaoNovaPostagem) {
    botaoNovaPostagem.addEventListener('click', incluirPostagem);
}

// Carrega as postagens do feed ao iniciar
listarPostagens();