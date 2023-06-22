// Pega o parâmetro admin da url e armazea na variável admin
const urlAdmin = new URL(window.location.href);
const admin = urlAdmin.searchParams.get("admin");

// Obtém o parâmetro id_tabela da URL
const urlParams = new URLSearchParams(window.location.search);
const idTabela = urlParams.get('id_numerico');

// Define a url usada para a requisição
const url = `/resultado?id_numerico=${idTabela}&admin=${admin}`;

// Realiza uma requisição para obter dados da tabela 
fetch(url)
    .then((response) => response.json())
    .then((data) => {
        console.log(data)
        // Atualiza o conteúdo no HTML com os dados do banco
        document.getElementById('tituloTabela').textContent = data[0].nome_tabela;
        document.getElementById('tituloTabelaPagina').textContent = data[0].nome_tabela;
        document.getElementById('conteudoTabela').textContent = data[0].conteudo_tabela;
        document.getElementById('conjuntoDeDados').textContent = data[0].conjunto_de_dados;
        document.getElementById('nomeDataOwner').textContent = data[0].nome_data_owner;
        document.getElementById('nomeDataSteward').textContent = data[0].nome_data_steward;
        document.getElementById('dataDeCriacao').textContent = data[0].data_de_criacao;
        document.getElementById('defasagemTabela').textContent = data[0].defasagem_tabela;
        document.getElementById('Frequencia').textContent = data[0].frequencia;
        document.getElementById('engIngestaoTabela').textContent = data[0].eng_ingestao_tabela;
        document.getElementById('infoDatabaseTabela').textContent = data[0].info_databese_tabela;
        document.getElementById('caminhoTabela').textContent = data[0].caminho_tabela;
        document.getElementById('tabelaOrigem').textContent = data[0].tabela_origem;
        document.getElementById('databaseOrigem').textContent = data[0].database_origem;
        document.getElementById('schemaOrigem').textContent = data[0].schema_origem;
        document.getElementById('sistemaOrigem').textContent = data[0].sistema_origem;
        document.getElementById('servidorOrigem').textContent = data[0].servidor_origem;
        document.getElementById('defasagemTabela2').textContent = data[0].defasagem_tabela;
        document.getElementById('Frequencia2').textContent = data[0].frequencia;
    })
    .catch((error) => {
        // Trata o erro
        console.error('Ocorreu um erro na requisição:', error);
    });
