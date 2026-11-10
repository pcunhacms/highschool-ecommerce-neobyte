/* =========================================================
   NeoByte Tecnologia - validação do formulário de contato
   ========================================================= */

const formContato = document.querySelector("#form-contato");
const mensagemContato = document.querySelector("#mensagem-contato");
const campoMensagem = document.querySelector("#mensagem");
const contador = document.querySelector("#contador-caracteres");
const LIMITE = 500;

/* Contador de caracteres da mensagem */
campoMensagem.addEventListener("input", function () {
    const restantes = LIMITE - campoMensagem.value.length;
    contador.textContent = restantes + " caracteres restantes";
    contador.style.color = restantes < 50 ? "#b3261e" : "";
});

function erroContato(idCampo, texto) {
    const caixa = document.querySelector("#" + idCampo).closest(".campo");
    caixa.querySelector(".campo_erro").textContent = texto;
    if (texto) {
        caixa.classList.add("campo--erro");
    } else {
        caixa.classList.remove("campo--erro");
    }
}

formContato.addEventListener("submit", function (evento) {
    evento.preventDefault();

    let valido = true;
    const nome = document.querySelector("#nome-contato").value.trim();
    const email = document.querySelector("#email").value.trim();
    const telefone = document.querySelector("#telefone").value.trim();
    const assunto = document.querySelector("#assunto").value;
    const texto = campoMensagem.value.trim();

    // Nome com pelo menos duas palavras (nome e sobrenome)
    if (nome === "") {
        erroContato("nome-contato", "Informe seu nome.");
        valido = false;
    } else if (nome.split(" ").filter(parte => parte !== "").length < 2) {
        erroContato("nome-contato", "Informe nome e sobrenome.");
        valido = false;
    } else {
        erroContato("nome-contato", "");
    }

    // E-mail com formato simples usuario@dominio.algo
    const padraoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!padraoEmail.test(email)) {
        erroContato("email", "Informe um e-mail válido.");
        valido = false;
    } else {
        erroContato("email", "");
    }

    // Telefone é opcional, mas se preenchido precisa ter 10 ou 11 dígitos
    const digitos = telefone.replace(/\D/g, "");
    if (telefone !== "" && (digitos.length < 10 || digitos.length > 11)) {
        erroContato("telefone", "Telefone deve ter DDD + número (10 ou 11 dígitos).");
        valido = false;
    } else {
        erroContato("telefone", "");
    }

    if (assunto === "") {
        erroContato("assunto", "Escolha um assunto.");
        valido = false;
    } else {
        erroContato("assunto", "");
    }

    if (texto.length < 15) {
        erroContato("mensagem", "A mensagem precisa ter pelo menos 15 caracteres.");
        valido = false;
    } else {
        erroContato("mensagem", "");
    }

    if (valido) {
        mensagemContato.className = "mensagem mensagem--sucesso";
        mensagemContato.textContent = "Obrigado, " + nome.split(" ")[0] + "! Sua mensagem foi enviada. Responderemos em até 2 dias úteis.";
        formContato.reset();
        contador.textContent = LIMITE + " caracteres restantes";
    } else {
        mensagemContato.className = "mensagem mensagem--erro";
        mensagemContato.textContent = "Verifique os campos destacados.";
    }
});
