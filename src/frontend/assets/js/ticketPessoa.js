// Pega o parâmetro admin da url e armazea na variável admin
const urlAdmin = new URL(window.location.href);
const admin = urlAdmin.searchParams.get("admin");

// Obtém o parâmetro id_tabela da URL.
const urlParams = new URLSearchParams(window.location.search);
const idTabela = urlParams.get('id_numerico');

// Define a url usada para a requisição do titulo da tabela.
const url = `/tabela/nome?id_numerico=${idTabela}`;

// Realiza uma requisição para obter o titulo da tabela.
fetch(url)
    .then((response) => response.json())
    .then((data) => {
        // Atualiza o título da tabela no HTML de acordo com o banco de dados.
        document.getElementById('tituloTabela').textContent = data[0].nome_tabela;
    })
    .catch((error) => {
        // Trata erros de requisição.
        console.error('Erro:', error);
    });

//Função chamada quandoc o botão continuar é pressionado.
function continuarTicket(event) {
    event.preventDefault()

    // Armazena os valores inseridos pelo usuário no input em variáveis.
    var nome = document.getElementById('nome').value;
    var email = document.getElementById('email').value;
    var motivo = document.getElementById('motivo').value;

    // Armazena os valores no Local Storage
    localStorage.setItem('nome', nome);
    localStorage.setItem('email', email);
    localStorage.setItem('motivo', motivo);

    // Obtém o parâmetro id_tabela da URL.
    const urlParams = new URLSearchParams(window.location.search);
    const idTabela = urlParams.get('id_numerico');
    // Codifica os valores das variáveis idTabela e idTicket usando a função encodeURIComponent.
    const encodedIdTabela = encodeURIComponent(idTabela);

    // Monta a string de URL contendo os parâmetros id_tabela e admin com seus respectivos valores.
    href = `/ticketGeral.html?id_numerico=${encodedIdTabela}&admin=${admin}`
    // Redireciona a página atual para a URL montada.
    window.location.href = href;
}