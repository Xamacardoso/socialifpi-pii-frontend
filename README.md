# 🚀 Frontend Social IFPI

Uma plataforma de blog interativa desenvolvida como projeto prático para demonstrar a construção de uma aplicação web moderna e funcional. O objetivo é criar um espaço dinâmico onde os usuários possam compartilhar e discutir ideias sobre tecnologia e inovação.

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Como Executar](#como-executar)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [API Endpoints](#api-endpoints)
- [Contribuição](#contribuição)
- [Autor](#autor)
- [Licença](#licença)

## 🎯 Sobre o Projeto

O **Social IFPI** é uma aplicação web que simula uma rede social focada em conteúdo, permitindo que os visitantes visualizem postagens e interajam com elas por meio de curtidas e comentários. O projeto foi desenvolvido como trabalho final da disciplina de **Programação para Internet I** do curso de **Análise e Desenvolvimento de Sistemas** do **Instituto Federal do Piauí (IFPI)**.

### Características Principais

- ✨ **Interface Moderna**: Design responsivo com tema escuro
- 🔍 **Sistema de Pesquisa**: Filtragem de postagens por termo, frase ou autor
- 💬 **Sistema de Comentários**: Interação completa com comentários recolhíveis
- 👍 **Sistema de Curtidas**: Interação social com contadores
- 📝 **CRUD Completo**: Criação, leitura, atualização e exclusão de postagens

## ⚡ Funcionalidades

### ✅ Implementadas

- **Criação de Postagens**: Formulário para adicionar novas postagens
- **Visualização e Filtragem**: Listagem de postagens com sistema de busca
- **Edição de Posts**: Interface para modificar postagens existentes
- **Exclusão de Posts**: Remoção de postagens com confirmação
- **Sistema de Curtidas**: Interação social com contadores visuais
- **Seção de Comentários**: Sistema completo de comentários recolhível
- **Modal de Confirmação**: Confirmações para ações destrutivas
- **Design Responsivo**: Adaptação para diferentes tamanhos de tela
- **Navegação Intuitiva**: Menu de navegação com links externos

### 🔄 Funcionalidades Técnicas

- **TypeScript**: Código tipado e robusto
- **API REST**: Comunicação com backend via fetch
- **CSS Variables**: Sistema de cores consistente
- **Font Awesome**: Ícones modernos e acessíveis

## 🛠️ Tecnologias Utilizadas

### Frontend
- **HTML5**: Estrutura semântica e acessível
- **CSS3**: Estilização moderna com variáveis CSS e Flexbox/Grid
- **TypeScript**: JavaScript tipado para maior robustez
- **Font Awesome**: Biblioteca de ícones

### Desenvolvimento
- **TypeScript Compiler**: Configuração ES2016
- **Git**: Controle de versão
- **VS Code**: Ambiente de desenvolvimento

### APIs e Comunicação
- **Fetch API**: Comunicação com backend REST
- **JSON**: Formato de dados
- **HTTP Methods**: GET, POST, PUT, DELETE

## 🚀 Como Executar

### Pré-requisitos

- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Servidor local (opcional, para desenvolvimento)
- Backend API rodando em `http://localhost:3000` (para funcionalidades completas)

### Instalação

1. **Clone o repositório**
   ```bash
   git clone https://github.com/Xamacardoso/socialifpi-pii-frontend.git
   cd social-ifpi
   ```

2. **Abra o projeto**
   - Abra o arquivo `index.html` em seu navegador
   - Ou use um servidor local (como Live Server)

3. **Configure o Backend** (opcional)
   - Certifique-se de que a API está rodando em `http://localhost:3000`
   - O endpoint base é: `http://localhost:3000/socialifpi/postagem`

### Executando o Projeto

1. Abra `index.html` no navegador
2. Para funcionalidades completas, inicie o backend
3. Explore as funcionalidades de criação, edição e interação

## 📁 Estrutura do Projeto

```
front-end/
├── index.html              # Página principal
├── sobre.html              # Página sobre o projeto
├── editarPost.html         # Página de edição de posts
├── app.js                  # JavaScript compilado (TypeScript)
├── app.ts                  # Código fonte TypeScript
├── editarPost.js           # JavaScript da página de edição
├── editarPost.ts           # TypeScript da página de edição
├── estilos.css             # Estilos principais
├── sobre-estilos.css       # Estilos da página sobre
└── tsconfig.json           # Configuração TypeScript
```

## 🔌 API Endpoints

O projeto se comunica com uma API REST através dos seguintes endpoints:

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/socialifpi/postagem` | Lista todas as postagens |
| `POST` | `/socialifpi/postagem` | Cria nova postagem |
| `PUT` | `/socialifpi/postagem/:id` | Atualiza postagem |
| `DELETE` | `/socialifpi/postagem/:id` | Remove postagem |
| `POST` | `/socialifpi/postagem/:id/curtir` | Incrementa curtidas |
| `POST` | `/socialifpi/postagem/:id/comentario` | Adiciona comentário |
| `DELETE` | `/socialifpi/postagem/:id/comentario/:comentarioId` | Remove comentário |

### Estrutura de Dados

**Postagem:**
```json
{
  "_id": "string",
  "titulo": "string",
  "conteudo": "string",
  "data": "Date",
  "curtidas": "number",
  "comentarios": [
    {
      "_id": "string",
      "autor": "string",
      "conteudo": "string",
      "data": "Date"
    }
  ]
}
```

---

<div align="center">

**Feito com ❤️ por Xamã Cardoso Mendes Santos**

*Projeto desenvolvido para a disciplina de Programação para Internet I - IFPI*

[![IFPI](https://img.shields.io/badge/IFPI-Instituto%20Federal%20do%20Piauí-blue)](https://www.ifpi.edu.br/)

</div> 