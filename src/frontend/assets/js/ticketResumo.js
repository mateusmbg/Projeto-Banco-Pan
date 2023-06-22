// Pega o parâmetro admin da url e armazena na variável admin
const urlAdmin = new URL(window.location.href);
const admin = urlAdmin.searchParams.get("admin");

// Obtém o parâmetro id_tabela e id_ticket da URL
const urlParams = new URLSearchParams(window.location.search);
const idTabela = urlParams.get('id_numerico');

// Define a url usada para a requisição do título da tabela.
const url = `/tabela/nome?id_numerico=${idTabela}`;

// Realiza uma requisição para obter o título da tabela.
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

// Recupera e armazena em variável a informaçõe armazenada no local storage.
var resumo = localStorage.getItem('resumoAlteracoes');

// Obtém uma referência para o elemento HTML.
var elementoResumo = document.getElementById("resumoAlteracoes");

// Atualiza o conteúdo do elemento HTML com o valor da variável 'resumo'.
elementoResumo.innerHTML = resumo;

function cancelarTicket() {
    window.location.href = `resultado.html?id_numerico=${idTabela}&admin=${admin}`;
}

// Função para enviar ticket
function enviarTicket() {
    // Recupera as informações armazenadas no local storage
    var updateQuery = localStorage.getItem('updateQuery');
    var nome = localStorage.getItem('nome');
    var email = localStorage.getItem('email');
    var motivo = localStorage.getItem('motivo');

    // Define o corpo da requisição
    const body = `nome|${nome}\nemail|${email}\nmotivo|${motivo}\nid_numerico|${idTabela}\nupdate_query|${updateQuery}\nstatus|pendente\nresumo|${resumo}`;

    // Realiza uma requisição para enviar o ticket
    fetch('/ticket/solicitacao', {
        // Define o método, tipo de conteúdo e as informações a serem enviadas.
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain'
        },
        body: body
    })
        .catch(error => {
            // Trata erros de requisição
            console.error('Erro:', error);
        });

    // Aciona o popup após enviar o ticket
    acionarPopup();
}

// Função para acionar o popup
function acionarPopup() {
    const popup = document.querySelector('.popup');
    // Remove a classe 'hidden' do popup, fazendo-o aparecer
    popup.classList.remove('hidden');
}

// Adiciona um ouvinte de evento ao botão de fechar
document.querySelector('.close-button').addEventListener('click', function () {
    const popup = document.querySelector('.popup');
    // Adiciona a classe 'hidden' ao popup, fazendo-o desaparecer
    popup.classList.add('hidden');
    // Redireciona para a página inicial com o parâmetro admin
    window.location.href = `home.html?admin=${admin}`;
});
