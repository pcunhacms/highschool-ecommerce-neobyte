/* =========================================================
   cadastro de produtos
   valida o formulário com js e adiciona o novo produto ao vetor "produtos".
   ========================================================= */

const formCadastro = document.querySelector("#form-cadastro");
const mensagemCadastro = document.querySelector("#mensagem-cadastro");
const corpoTabela = document.querySelector("#tabela-cadastrados tbody");
const totalProdutos = document.querySelector("#total-produtos");

/* preenche o select de categorias com as que já existem no vetor */
const selectCategoria = document.querySelector("#categoria");

const categoriasExistentes = listarCategorias();
for (let i = 0; i < categoriasExistentes.length; i++) {
    const opcao = document.createElement("option");
    opcao.value = categoriasExistentes[i];
    opcao.textContent = categoriasExistentes[i];
    selectCategoria.appendChild(opcao);
}

/* mostra/limpa a mensagem de erro de um campo */
function marcarErro(idCampo, texto) {
    const campo = document.querySelector("#" + idCampo);
    const caixa = campo.closest(".campo");
    const erro = caixa.querySelector(".campo_erro");

    if (texto) {
        caixa.classList.add("campo--erro");
        erro.textContent = texto;
    } else {
        caixa.classList.remove("campo--erro");
        erro.textContent = "";
    }
}

/* valida todos os campos e devolve true se estiver tudo certo */
function validarCadastro() {
    let valido = true;

    const nome = document.querySelector("#nome").value.trim();
    const preco = parseFloat(document.querySelector("#preco").value.replace(",", "."));
    const estoque = document.querySelector("#estoque").value;
    const categoria = selectCategoria.value;
    const descricao = document.querySelector("#descricao").value.trim();

    // nome obrigatorio, minimo 3 letras e nao pode repetir
    if (nome === "") {
        marcarErro("nome", "Informe o nome do produto.");
        valido = false;
    } else if (nome.length < 3) {
        marcarErro("nome", "O nome precisa ter pelo menos 3 caracteres.");
        valido = false;
    } else {
        let repetido = false;
        for (const p of produtos) {
            if (p.nome.toLowerCase() === nome.toLowerCase()) {
                repetido = true;
            }
        }
        if (repetido) {
            marcarErro("nome", "Já existe um produto com esse nome.");
            valido = false;
        } else {
            marcarErro("nome", "");
        }
    }

    // preco: > maior que zero
    if (isNaN(preco) || preco <= 0) {
        marcarErro("preco", "Informe um preço maior que zero.");
        valido = false;
    } else if (preco > 100000) {
        marcarErro("preco", "Preço muito alto. Confira o valor.");
        valido = false;
    } else {
        marcarErro("preco", "");
    }

   
    if (estoque === "" || Number(estoque) < 0 || !Number.isInteger(Number(estoque))) {
        marcarErro("estoque", "Informe uma quantidade inteira (0 ou mais).");
        valido = false;
    } else {
        marcarErro("estoque", "");
    }

    
    if (categoria === "") {
        marcarErro("categoria", "Escolha uma categoria.");
        valido = false;
    } else {
        marcarErro("categoria", "");
    }

    
    if (descricao.length < 10) {
        marcarErro("descricao", "Escreva uma descrição com pelo menos 10 caracteres.");
        valido = false;
    } else {
        marcarErro("descricao", "");
    }

    return valido;
}

/* lista os produtos do vetor na tabela */
function atualizarTabela() {
    let linhas = "";
    for (let i = 0; i < produtos.length; i++) {
        const p = produtos[i];
        linhas += `
            <tr>
                <td>${p.id}</td>
                <th scope="row">${p.nome}</th>
                <td>${p.categoria}</td>
                <td>${formatarPreco(p.preco)}</td>
                <td>${p.estoque}</td>
                <td><button type="button" class="botao botao--perigo" style="padding:4px 12px"
                     onclick="removerProduto(${p.id})">Excluir</button></td>
            </tr>`;
    }
    corpoTabela.innerHTML = linhas;
    totalProdutos.textContent = produtos.length;
}

/* remove um produto do vetor */
function removerProduto(id) {
    for (let i = 0; i < produtos.length; i++) {
        if (produtos[i].id === id) {
            if (confirm("Deseja realmente excluir \"" + produtos[i].nome + "\"?")) {
                produtos.splice(i, 1);
                atualizarTabela();
            }
            break;
        }
    }
}

/* Envio do formulário */
formCadastro.addEventListener("submit", function (evento) {
    evento.preventDefault();   // não recarrega a página (os dados ficam no vetor)

    if (!validarCadastro()) {
        mensagemCadastro.className = "mensagem mensagem--erro";
        mensagemCadastro.textContent = "Corrija os campos destacados antes de salvar.";
        return;
    }

    // Gera o próximo id
    let maiorId = 0;
    for (const p of produtos) {
        if (p.id > maiorId) maiorId = p.id;
    }

    const imagemEscolhida = document.querySelector("#imagem").value;

    const novoProduto = {
        id: maiorId + 1,
        nome: document.querySelector("#nome").value.trim(),
        categoria: selectCategoria.value,
        preco: parseFloat(document.querySelector("#preco").value.replace(",", ".")),
        estoque: Number(document.querySelector("#estoque").value),
        imagem: imagemEscolhida !== "" ? imagemEscolhida : "../img/padrao.svg",
        descricao: document.querySelector("#descricao").value.trim(),
        destaque: document.querySelector("#destaque").checked
    };

    produtos.push(novoProduto);
    atualizarTabela();

    mensagemCadastro.className = "mensagem mensagem--sucesso";
    mensagemCadastro.textContent = "Produto \"" + novoProduto.nome + "\" cadastrado com sucesso!";
    formCadastro.reset();
});

formCadastro.addEventListener("reset", function () {
    const ids = ["nome", "preco", "estoque", "categoria", "descricao"];
    for (const id of ids) {
        marcarErro(id, "");
    }
});

/* Pré-visualização da imagem escolhida */
const selectImagem = document.querySelector("#imagem");
const previa = document.querySelector("#previa-imagem");
selectImagem.addEventListener("change", function () {
    previa.src = selectImagem.value !== "" ? selectImagem.value : "../img/padrao.svg";
});

atualizarTabela();
