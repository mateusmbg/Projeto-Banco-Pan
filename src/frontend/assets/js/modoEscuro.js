// Obtém o valor armazenado no localStorage para o modo escuro
let darkMode = localStorage.getItem("darkMode");

// Obtém o elemento HTML do botão de alternar modo escuro e o armazena na variável 'darkModeToggle'
const darkModeToggle = document.querySelector("#button-modo-escuro");

// Obtém o elemento HTML do logo do Banco Pan e o armazena na variável 'logoBancoPan'
var logoBancoPan = document.getElementById("logoBancoPan");

// Armazena o atributo 'src' original do logo em uma variável separada
const logoBancoPanSrc = logoBancoPan.getAttribute("src");

// Evento 'load' é acionado quando a página é carregada
window.addEventListener("load", () => {
    // Verifica se o modo escuro está habilitado e marca o botão de alternar modo escuro
    if (darkMode == "enabled") {
        darkModeToggle.checked = true;
        // Atualiza a imagem do logo para a versão do modo escuro
        logoBancoPan.src = logoBancoPan.getAttribute("data-dark-src");
    } else {
        // Mantém a imagem do logo padrão
        logoBancoPan.src = logoBancoPanSrc;
    }
});

// Função para habilitar o modo escuro
const enableDarkMode = () => {
    // Adiciona a classe 'darkmode' ao elemento 'body' para aplicar estilos do modo escuro
    document.body.classList.add("darkmode");
    // Atualiza a imagem do logo para a versão do modo escuro
    logoBancoPan.src = logoBancoPan.getAttribute("data-dark-src");
    // Armazena o valor 'enabled' no localStorage para indicar que o modo escuro está habilitado
    localStorage.setItem("darkMode", "enabled");
};

// Função para desabilitar o modo escuro
const disableDarkMode = () => {
    // Remove a classe 'darkmode' do elemento 'body' para remover os estilos do modo escuro
    document.body.classList.remove("darkmode");
    // Remove o valor do modo escuro do localStorage
    localStorage.removeItem("darkMode");
    // Restaura a imagem do logo para o padrão
    logoBancoPan.src = logoBancoPanSrc;
};

// Verifica se o modo escuro está habilitado e chama a função para habilitá-lo
if (darkMode == 'enabled') {
    enableDarkMode();
}

darkModeToggle.addEventListener("click", () => {
    // Verifica o valor atual do modo escuro no localStorage
    darkMode = localStorage.getItem("darkMode");

    // Verifica se o modo escuro está habilitado e chama a função correspondente para alterná-lo
    if (darkMode !== "enabled") {
        enableDarkMode();
    } else {
        disableDarkMode();
    }

    // Atualiza o valor do modo escuro no localStorage após alternar
    darkMode = localStorage.getItem("darkMode");
});
