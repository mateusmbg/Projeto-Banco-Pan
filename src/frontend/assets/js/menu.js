// Variável para armazenar o estado atual do menu (aberto ou fechado)
let menuIsOpen = false;

// Obtém o elemento HTML com o id 'menu' e o armazena na variável 'menu'
var menu = document.getElementById("menu");
var iconeBars = document.getElementById("iconeBars");
var iconeFechar = document.getElementById("iconeFechar");


// Função para alternar o estado do menu
function switchMenu() {
    // Verifica se o menu está fechado
    if (!menuIsOpen) {
        // Abrir o menu
        menu.classList.add("menuIsOpen");
        // Remove a classe 'menuIsClose' do elemento 'menu'
        menu.classList.remove("menuIsClose");
        // Altera as classes do ícone para mostrar o ícone de fechar
        iconeBars.classList.remove("fa-solid", "fa-bars", "cursor");
        iconeFechar.classList.add("fa-solid", "fa-circle-xmark", "cursor");
        // Atualiza o estado do menu para aberto
        menuIsOpen = true;
        return;
    } else {
        // Fechar o menu
        menu.classList.remove("menuIsOpen");
        // Adiciona a classe 'menuIsClose' ao elemento 'menu'
        menu.classList.add("menuIsClose");
        // Altera as classes do ícone para mostrar o ícone de barras
        iconeBars.classList.add("fa-solid", "fa-bars", "cursor");
        iconeFechar.classList.remove("fa-solid", "fa-circle-xmark", "cursor");
        // Atualiza o estado do menu para fechado
        menuIsOpen = false;
        return;
    }
}

// Adiciona um ouvinte de evento para o evento de clique
document.addEventListener("click", function (event) {
    // Fechar o menu quando clicar fora dele, exceto no ícone de barras
    if (menuIsOpen && !menu.contains(event.target) && event.target !== iconeBars) {
        switchMenu();
    }
});

// Adiciona um ouvinte de evento para o evento de rolagem da página
document.addEventListener("scroll", function () {
    // Fechar o menu quando ocorrer o evento de rolagem
    if (menuIsOpen) {
        switchMenu();
    }
});

// Pega o parâmetro admin da url e armazea na variável isAdmin
const urlIsAdmin = new URL(window.location.href);
const isAdmin = urlIsAdmin.searchParams.get("admin");

// Aponta para o elemento do html cujo id é ticketIcon
const ticketIcon = document.getElementById("ticketIcon");

// Altera os botões internos do menu de acordo com o valor do parâmetro admin
if (isAdmin == "nao" || !isAdmin) {
    // se for igual a 'nao' ou se for nulo, muda a classe do elemento ticketIcon
    ticketIcon.className = "fa-sharp fa-solid fa-lock cursor";
} else if (isAdmin == "sim") {
    // se for igual a 'sim', muda a classe do elemento ticketIcon e adiciona um evento de click
    ticketIcon.className = "fa-sharp fa-solid fa-lock-open cursor";
    // Adiciona redirecionamento no botão Tickets e passa o parâmetro admin junto da url
    document.getElementById("abrirTicketOwner").addEventListener("click", () => {
        document.location.href = `/ticketsOwner.html?admin=${isAdmin}`;
    });
}

// Adiciona redirecionamento no botão Pesquisar e passa o parâmetro admin junto da url
document.getElementById("atalhoPesquisar").addEventListener("click", () => {
    document.location.href = `/home.html?admin=${isAdmin}`;
});