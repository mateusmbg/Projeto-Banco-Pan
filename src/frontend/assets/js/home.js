// Pega o parâmetro admin da url e armazea na variável admin
const urlAdmin = new URL(window.location.href);
const admin = urlAdmin.searchParams.get("admin");

//função redireciona para a tela pesquisa.html, a partir do botão
function redirectToSearch(event) {
    // Impede o envio padrão do formulário
    event.preventDefault(); 

    var procuraTermo = document.getElementById('pesquisa').value;
    var url = 'pesquisa.html?term=' + encodeURIComponent(procuraTermo) + '&admin=' + admin;

    window.location.href = url;
}
//função muda para a tela pesquisa.html, a partir do enter
function handleKeyDown(event) {
    if (event.keyCode === 13) { 
        // Verifica se a tecla pressionada é a tecla Enter
        redirectToSearch(event);
    }
}