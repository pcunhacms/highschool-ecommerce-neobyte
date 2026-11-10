/* =========================================================
   NeoByte Tecnologia - exibição dos produtos
   Usado na página inicial (destaques) e na página de produtos
   (pesquisa, filtro por categoria, ordenação e detalhes).
   ========================================================= */

/* Monta o HTML de um card de produto */
function criarCard(produto) {
    let selo = "";
    if (produto.estoque === 0) {
        selo = '<span class="selo selo--esgotado">Esgotado</span>';
    } else if (produto.estoque <= 5) {
        selo = '<span class="selo">Últimas ' + produto.estoque + ' unidades</span>';
    }

    return `
        <li class="produto">
            <img class="produto_figura" src="${produto.imagem}" alt="Imagem do produto ${produto.nome}">
            <div class="produto_corpo">
                <p class="produto_categoria">${produto.categoria}</p>
                <h3 class="produto_nome">${produto.nome}</h3>
                <p class="produto_texto">${produto.descricao}</p>
                <div>${selo}</div>
                <p class="produto_preco">${formatarPreco(produto.preco)}</p>
                <div class="produto_botoes">
                    <button type="button" class="botao" onclick="adicionarAoCarrinho(${produto.id})"
                        ${produto.estoque === 0 ? "disabled style=\"opacity:.5;cursor:not-allowed\"" : ""}>
                        Adicionar ao carrinho
                    </button>
                    <button type="button" class="botao botao--secundario" onclick="mostrarDetalhes(${produto.id})">
                        Ver detalhes
                    </button>
                </div>
            </div>
        </li>`;
}

/* Desenha uma lista de produtos dentro de um <ul> usando laço de repetição */
function exibirProdutos(lista, elemento) {
    let html = "";
    for (let i = 0; i < lista.length; i++) {
        html += criarCard(lista[i]);
    }
    elemento.innerHTML = html;
}

/* ---------- Página inicial: só os produtos em destaque ---------- */
const listaDestaques = document.querySelector("#lista-destaques");

if (listaDestaques) {
    const destaques = [];
    for (const produto of produtos) {
        if (produto.destaque) {
            destaques.push(produto);
        }
    }
    exibirProdutos(destaques, listaDestaques);
}

/* ---------- Página de produtos: pesquisa, filtro e ordenação ---------- */
const listaProdutos = document.querySelector("#lista-produtos");
const campoBusca = document.querySelector("#busca");
const campoCategoria = document.querySelector("#filtro-categoria");
const campoOrdem = document.querySelector("#ordem");
const infoResultado = document.querySelector("#resultado-info");

if (listaProdutos) {
    // Preenche o <select> de categorias a partir do vetor
    const categorias = listarCategorias();
    for (let i = 0; i < categorias.length; i++) {
        const opcao = document.createElement("option");
        opcao.value = categorias[i];
        opcao.textContent = categorias[i];
        campoCategoria.appendChild(opcao);
    }

    // Se a página foi aberta com ?categoria=Áudio, já aplica o filtro
    const parametros = new URLSearchParams(window.location.search);
    if (parametros.has("categoria")) {
        campoCategoria.value = parametros.get("categoria");
    }

    campoBusca.addEventListener("input", aplicarFiltros);
    campoCategoria.addEventListener("change", aplicarFiltros);
    campoOrdem.addEventListener("change", aplicarFiltros);

    aplicarFiltros();
    montarTabelaComparativa();
}

function aplicarFiltros() {
    const termo = campoBusca.value.trim().toLowerCase();
    const categoria = campoCategoria.value;
    const ordem = campoOrdem.value;

    // Filtra com estrutura de repetição + decisões
    const filtrados = [];
    for (const produto of produtos) {
        const nomeBate = produto.nome.toLowerCase().includes(termo) ||
                         produto.descricao.toLowerCase().includes(termo);
        const categoriaBate = (categoria === "todas" || produto.categoria === categoria);

        if (nomeBate && categoriaBate) {
            filtrados.push(produto);
        }
    }

    // Ordenação escolhida pelo usuário
    switch (ordem) {
        case "menor-preco":
            filtrados.sort((a, b) => a.preco - b.preco);
            break;
        case "maior-preco":
            filtrados.sort((a, b) => b.preco - a.preco);
            break;
        case "nome":
            filtrados.sort((a, b) => a.nome.localeCompare(b.nome));
            break;
        default:
            // mantém a ordem original do vetor
            break;
    }

    if (filtrados.length === 0) {
        listaProdutos.innerHTML = '<li class="vazio">Nenhum produto encontrado. Tente outro termo ou categoria.</li>';
        infoResultado.textContent = "0 produtos encontrados";
    } else {
        exibirProdutos(filtrados, listaProdutos);
        infoResultado.textContent = filtrados.length === 1
            ? "1 produto encontrado"
            : filtrados.length + " produtos encontrados";
    }
}

/* Tabela comparativa gerada a partir do vetor */
function montarTabelaComparativa() {
    const corpo = document.querySelector("#tabela-produtos tbody");
    if (!corpo) return;

    let linhas = "";
    for (const produto of produtos) {
        const situacao = produto.estoque > 0 ? produto.estoque + " un." : "Esgotado";
        linhas += `
            <tr>
                <th scope="row">${produto.nome}</th>
                <td>${produto.categoria}</td>
                <td>${situacao}</td>
                <td>${formatarPreco(produto.preco)}</td>
            </tr>`;
    }
    corpo.innerHTML = linhas;
}

/* ---------- Janela de detalhes ---------- */
function mostrarDetalhes(id) {
    const produto = buscarProdutoPorId(id);
    const janela = document.querySelector("#detalhes");
    if (!produto || !janela) return;

    janela.querySelector(".detalhes_img").src = produto.imagem;
    janela.querySelector(".detalhes_img").alt = "Imagem do produto " + produto.nome;
    janela.querySelector(".detalhes_nome").textContent = produto.nome;
    janela.querySelector(".detalhes_desc").textContent = produto.descricao;
    janela.querySelector(".detalhes_categoria").textContent = produto.categoria;
    janela.querySelector(".detalhes_preco").textContent = formatarPreco(produto.preco);
    janela.querySelector(".detalhes_estoque").textContent =
        produto.estoque > 0 ? produto.estoque + " unidades" : "Esgotado";
    janela.querySelector(".detalhes_parcela").textContent =
        "10x de " + formatarPreco(produto.preco / 10) + " sem juros";

    janela.showModal();
}

const botaoFechar = document.querySelector("#fechar-detalhes");
if (botaoFechar) {
    botaoFechar.addEventListener("click", function () {
        document.querySelector("#detalhes").close();
    });
}
