/* =========================================================
   NeoByte Tecnologia - dados e funções compartilhadas
   Os produtos ficam guardados TEMPORARIAMENTE neste vetor (array).
   Cada produto é um objeto; na Entrega 2 a mesma estrutura
   vira JSON vindo do PHP/banco de dados.
   ========================================================= */

const produtos = [
    { id: 1, nome: "Notebook Ultra 14", categoria: "Notebooks", preco: 4299.90, estoque: 8,  imagem: "img/notebook.svg",
      descricao: "Tela 14\" Full HD, processador de 8 núcleos, 16 GB de RAM e SSD de 512 GB.", destaque: true },
    { id: 2, nome: "Notebook Gamer X15", categoria: "Notebooks", preco: 7899.00, estoque: 3,  imagem: "img/notebook.svg",
      descricao: "Placa de vídeo dedicada, tela 144 Hz e teclado RGB para jogos pesados.", destaque: false },
    { id: 3, nome: "Smartphone Nova 5G", categoria: "Smartphones", preco: 2199.00, estoque: 15, imagem: "img/smartphone.svg",
      descricao: "Câmera tripla de 50 MP, bateria de 5000 mAh e conexão 5G.", destaque: true },
    { id: 4, nome: "Smartphone Lite", categoria: "Smartphones", preco: 1149.90, estoque: 0,  imagem: "img/smartphone.svg",
      descricao: "Ótimo custo-benefício, 128 GB de armazenamento e tela de 6,5\".", destaque: false },
    { id: 5, nome: "Fone Bluetooth Pulse", categoria: "Áudio", preco: 349.90, estoque: 20, imagem: "img/fone.svg",
      descricao: "Cancelamento de ruído ativo e até 30 horas de bateria.", destaque: true },
    { id: 6, nome: "Caixa de Som Boom", categoria: "Áudio", preco: 279.00, estoque: 12, imagem: "img/caixa-som.svg",
      descricao: "Resistente à água (IPX7), som 360° e 12 horas de reprodução.", destaque: false },
    { id: 7, nome: "Teclado Mecânico K70", categoria: "Periféricos", preco: 459.90, estoque: 10, imagem: "img/teclado.svg",
      descricao: "Switches mecânicos, iluminação RGB e layout ABNT2.", destaque: false },
    { id: 8, nome: "Mouse Sem Fio Glide", categoria: "Periféricos", preco: 129.90, estoque: 25, imagem: "img/mouse.svg",
      descricao: "Sensor de 16.000 DPI, design ergonômico e bateria recarregável.", destaque: false },
    { id: 9, nome: "Monitor 27\" QHD", categoria: "Monitores", preco: 1899.00, estoque: 6,  imagem: "img/monitor.svg",
      descricao: "Painel IPS 2560x1440, 165 Hz e bordas finas.", destaque: false },
    { id: 10, nome: "Smartwatch Fit", categoria: "Vestíveis", preco: 599.00, estoque: 9,  imagem: "img/smartwatch.svg",
      descricao: "Monitor cardíaco, GPS integrado e mais de 100 modos de treino.", destaque: false }
];

/* Formata número como moeda brasileira: 1234.5 -> "R$ 1.234,50" */
function formatarPreco(valor) {
    return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

/* Retorna a lista de categorias sem repetição (estrutura de repetição + decisão) */
function listarCategorias() {
    const categorias = [];
    for (let i = 0; i < produtos.length; i++) {
        if (!categorias.includes(produtos[i].categoria)) {
            categorias.push(produtos[i].categoria);
        }
    }
    return categorias.sort();
}

/* Busca um produto pelo id */
function buscarProdutoPorId(id) {
    for (const produto of produtos) {
        if (produto.id === id) {
            return produto;
        }
    }
    return null;
}

/* ---------- Menu responsivo (abre/fecha no celular) ---------- */
const botaoMenu = document.querySelector(".menu_botao");
const menu = document.querySelector(".menu");

if (botaoMenu && menu) {
    botaoMenu.addEventListener("click", function () {
        menu.classList.toggle("aberto");
        const aberto = menu.classList.contains("aberto");
        botaoMenu.setAttribute("aria-expanded", aberto);
        botaoMenu.textContent = aberto ? "✕" : "☰";
    });
}

/* ---------- Carrinho simples (contador) ---------- */
let itensCarrinho = 0;

function adicionarAoCarrinho(id) {
    const produto = buscarProdutoPorId(id);

    if (produto === null) {
        alert("Produto não encontrado.");
    } else if (produto.estoque <= 0) {
        alert("Desculpe, " + produto.nome + " está esgotado.");
    } else {
        itensCarrinho++;
        const contador = document.querySelector("#contador-carrinho");
        if (contador) {
            contador.textContent = itensCarrinho;
        }
        alert(produto.nome + " foi adicionado ao carrinho!");
    }
}
