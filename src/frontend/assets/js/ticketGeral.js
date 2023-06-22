// Pega o parâmetro admin da url e armazea na variável admin
const urlAdmin = new URL(window.location.href);
const admin = urlAdmin.searchParams.get("admin");

// Obtém o parâmetro id_tabela e id_ticket da URL.
const urlParams = new URLSearchParams(window.location.search);
const idTabela = urlParams.get('id_numerico');

// Define arrays vazios para armazenarem as cláusulas SET das atualizações dos dados.
var clausulasSetCatDadosConexoes = [];
var clausulasSetCatDadosOwner = [];
var clausulasSetCatDadosTabela = [];

// Define um array vazio para armazenar as atualizações dos dados de cada tabela.
var updates = [];

// Define um array vazio para armazenar todas as atualizações dos dados de todas as tabelas em uma string.
var updateQuery = [];

// Variável para armazenar as alterações feitas.
var alteracoes = {};

// Define a url usada para a requisição.
const url1 = `/resultado?id_numerico=${idTabela}`;

// Realiza uma requisição para obter dados da tabela.
fetch(url1)
  .then((response) => response.json())
  .then((data) => {
    // Atualiza o conteúdo no HTML com os dados do banco.
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
    document.getElementById('defasagemTabela').textContent = data[0].defasagem_tabela;
    document.getElementById('Frequencia').textContent = data[0].frequencia;
  });

// Define a url usada para a requisição
const url2 = `/campos?id_numerico=${idTabela}`;

// Realiza uma requisição para obter dados da tabela.
fetch(url2)
  .then((response) => response.json())
  .then((data) => {
    // Obtém referências aos elementos da tabela e aos modelos de linha.
    const tabelaCorpo = document.getElementById('campos');
    const linhaModelo = document.getElementById('LinhaModelo');
    const linhaInfoAdicionalModelo = document.getElementById('infoAdicional');

    // Inicializa o índice da tabela.
    let indice = 1;

    // Itera sobre os dados e cria as linhas da tabela.
    data.forEach((item) => {
      const novaLinha = linhaModelo.cloneNode(true);
      novaLinha.removeAttribute('id');
      novaLinha.style.display = '';

      // Preenche a primeira coluna (Índice).
      const colunaIndice = novaLinha.querySelector('#indice');
      colunaIndice.textContent = indice++;

      // Preenche a segunda coluna (Nome do Campo).
      const colunaNomeCampo = novaLinha.querySelector('#nomeCampo');
      colunaNomeCampo.textContent = item.nome_campo;

      // Preenche a terceira coluna (Descrição do Campo).
      const colunaDescricaoCampo = novaLinha.querySelector('#descricao_Campo');
      colunaDescricaoCampo.textContent = item.descricao_campo;
      // Adiciona um evento de alteração à coluna de descrição do campo.
      colunaDescricaoCampo.addEventListener('change', function () {
        // Registra a alteração do campo, passando o nome da variável, o campo e o novo valor como parâmetros.
        registrarAlteracaoCampo(item.nome_campo, 'Descrição do campo', this.value);
        // Registra a alteração do campo, passando o nome do campo no padrão do banco de dados, o novo valor e o ID da variável como parâmetros.
        registrarAlteracaoCatDadosVariaveis('descricao_campo', this.value, item.id_variavel);
      });

      // Cria uma nova linha para informações adicionais.
      const novaLinhaInfoAdicional = linhaInfoAdicionalModelo.cloneNode(true);
      novaLinhaInfoAdicional.classList.remove('additional-info');
      novaLinhaInfoAdicional.style.display = 'none';

      // Preenche as informações adicionais na tabela com os valores correspondentes e adiciona eventos de alteração para cada informação, chamando as funções para registrar as alterações ocorridas nos campos.
      const descricaoCampo = novaLinhaInfoAdicional.querySelector('#descricaoCampo');
      descricaoCampo.textContent = item.descricao_campo;
      descricaoCampo.addEventListener('change', function () {
        registrarAlteracaoCampo(item.nome_campo, 'Descrição do campo', this.value);
        registrarAlteracaoCatDadosVariaveis('descricao_campo', this.value, item.id_variavel);
      });


      // Preenche as informações adicionais na tabela com os valores correspondentes e adiciona eventos de alteração para cada informação, chamando as funções para registrar as alterações ocorridas nos campos.
      const tipoCampo = novaLinhaInfoAdicional.querySelector('#tipoCampo');
      tipoCampo.textContent = item.tipo_campo;
      tipoCampo.addEventListener('change', function () {
        registrarAlteracaoCampo(item.nome_campo, 'Tipo do campo', this.value);
        registrarAlteracaoCatDadosVariaveis('tipo_campo', this.value, item.id_variavel);
      });

      const tipoPessoa = novaLinhaInfoAdicional.querySelector('#tipoPessoa');
      tipoPessoa.textContent = item.tipo_pessoa;
      tipoPessoa.addEventListener('change', function () {
        registrarAlteracaoCampo(item.nome_campo, 'Tipo de pessoa', this.value);
        registrarAlteracaoCatDadosVariaveis('tipo_pessoa', this.value, item.id_variavel);
      });

      const amostraCampo = novaLinhaInfoAdicional.querySelector('#amostraCampo');
      amostraCampo.textContent = item.amostra_campo;
      amostraCampo.addEventListener('change', function () {
        registrarAlteracaoCampo(item.nome_campo, 'Amostra do campo', this.value);
        registrarAlteracaoCatDadosVariaveis('amostra_campo', this.value, item.id_variavel);
      });

      const chavePrimaria = novaLinhaInfoAdicional.querySelector('#chavePrimaria');
      chavePrimaria.textContent = item.ch_primaria;
      chavePrimaria.addEventListener('change', function () {
        registrarAlteracaoCampo(item.nome_campo, 'Chave primária', this.value);
        registrarAlteracaoCatDadosVariaveis('ch_primaria', this.value, item.id_variavel);
      });

      const nullCampo = novaLinhaInfoAdicional.querySelector('#nullCampo');
      nullCampo.textContent = item.null_campo;
      nullCampo.addEventListener('change', function () {
        registrarAlteracaoCampo(item.nome_campo, 'Null campo', this.value);
        registrarAlteracaoCatDadosVariaveis('null_campo', this.value, item.id_variavel);
      });

      const unq = novaLinhaInfoAdicional.querySelector('#unq');
      unq.textContent = item.unq;
      unq.addEventListener('change', function () {
        registrarAlteracaoCampo(item.nome_campo, 'Unq', this.value);
        registrarAlteracaoCatDadosVariaveis('unq', this.value, item.id_variavel);
      });

      const volatil = novaLinhaInfoAdicional.querySelector('#volatil');
      volatil.textContent = item.volatil;
      volatil.addEventListener('change', function () {
        registrarAlteracaoCampo(item.nome_campo, 'Volatil', this.value);
        registrarAlteracaoCatDadosVariaveis('volatil', this.value, item.id_variavel);
      });

      const lgpd = novaLinhaInfoAdicional.querySelector('#lgpd');
      lgpd.textContent = item.lgpd;
      lgpd.addEventListener('change', function () {
        registrarAlteracaoCampo(item.nome_campo, 'Lgpd', this.value);
        registrarAlteracaoCatDadosVariaveis('lgpd', this.value, item.id_variavel);
      });

      // Adiciona um evento de clique para exibir/ocultar informações adicionais.
      const botaoMaisInfo = novaLinha.querySelector('.fa-plus');
      botaoMaisInfo.addEventListener('click', () => {
        if (novaLinhaInfoAdicional.style.display === 'none') {
          novaLinhaInfoAdicional.style.display = '';
          botaoMaisInfo.classList.remove('fa-plus');
          botaoMaisInfo.classList.add('fa-minus');
        } else {
          novaLinhaInfoAdicional.style.display = 'none';
          botaoMaisInfo.classList.remove('fa-minus');
          botaoMaisInfo.classList.add('fa-plus');
        }
      });

      // Adiciona as linhas à tabela
      tabelaCorpo.appendChild(novaLinha);
      tabelaCorpo.appendChild(novaLinhaInfoAdicional);
    });

    // Verifica se a tabela possui pelo menos uma linha e remove a primeira div vazia
    if (tabelaCorpo.children.length > 0) {
      const primeiraDivVazia = tabelaCorpo.querySelector('.nome:empty');
      if (primeiraDivVazia) {
        primeiraDivVazia.parentNode.remove();
      }
    }
  })
  .catch((error) => {
    console.log('Erro ao obter os dados da tabela:', error);
  });

// Função para adicionar um evento de alteração para um campo da tabela.
function adicionarEventListener(idElemento, campo, campoBanco, tabela) {
  //Adiciona um evento de alteração para o campo.
  document.getElementById(idElemento).addEventListener('change', function () {
    //Função para registrar a alteração do campo, recebe o campo e o novo valor como parâmetros.
    registrarAlteracao(campo, this.value);
    //Chama a função para registrar a alteração do campo de acordo com a tabela que o campo pertence.
    if (tabela === 'cat_dados_conexoes') {
      registrarAlteracaoCatDadosConexoes(campoBanco, this.value);
    } else if (tabela === 'cat_dados_owner') {
      registrarAlteracaoCatDadosOwner(campoBanco, this.value);
    } else if (tabela === 'cat_dados_tabela') {
      registrarAlteracaoCatDadosTabela(campoBanco, this.value);
    }
  });
}

// Chama a função para adicionar um evento de alteração para cada campo desejado.
adicionarEventListener('conteudoTabela', 'Descrição da tabela', 'conteudo_tabela', 'cat_dados_tabela');
adicionarEventListener('conjuntoDeDados', 'Conjunto de dados', 'conjunto_de_dados', 'cat_dados_owner');
adicionarEventListener('nomeDataOwner', 'Owner', 'nome_data_owner', 'cat_dados_owner');
adicionarEventListener('nomeDataSteward', 'Steward', 'nome_data_steward', 'cat_dados_owner');
adicionarEventListener('dataDeCriacao', 'Data de criação', 'data_de_criacao', 'cat_dados_owner');
adicionarEventListener('defasagemTabela', 'Defasagem', 'defasagem_tabela', 'cat_dados_tabela');
adicionarEventListener('Frequencia', 'Frequência de atualização', 'frequencia', 'cat_dados_conexoes');
adicionarEventListener('engIngestaoTabela', 'Engenheiro responsável pela ingestão', 'eng_ingestao_tabela', 'cat_dados_tabela');
adicionarEventListener('infoDatabaseTabela', 'Database', 'info_database_tabela', 'cat_dados_tabela');
adicionarEventListener('caminhoTabela', 'Caminho Tabela', 'caminho_tabela', 'cat_dados_tabela');
adicionarEventListener('tabelaOrigem', 'Nome da Tabela na Origem', 'tabela_origem', 'cat_dados_conexoes');
adicionarEventListener('databaseOrigem', 'Database origem', 'database_origem', 'cat_dados_conexoes');
adicionarEventListener('schemaOrigem', 'Schema', 'schema_origem', 'cat_dados_conexoes');
adicionarEventListener('sistemaOrigem', 'Sistema', 'sistema_origem', 'cat_dados_conexoes');
adicionarEventListener('servidorOrigem', 'Servidor', 'servidor_origem', 'cat_dados_conexoes');

// Função para registrar uma alteração, armazenando as informacoes no objeto 'alteracoes'.
function registrarAlteracao(campo, valor) {
  alteracoes[campo] = valor;
}

// Função para registrar uma alteração de um campo específico de uma variável,armazenando as informacoes no objeto 'alteracoes'.
function registrarAlteracaoCampo(nomeVariavel, campo, novoValor) {
  var campoAlterado = nomeVariavel + " - " + campo;
  alteracoes[campoAlterado] = novoValor;
}

// Função para registrar as alterações dos campos da tabela 'cat_dados_conexoes' e armazenar em um mesmo objeto.
function registrarAlteracaoCatDadosConexoes(campoBanco, valor) {
  const clausulaSet = `${campoBanco} = '${valor}'`;
  clausulasSetCatDadosConexoes.push(clausulaSet);
}

// Função para registrar as alterações dos campos da tabela 'cat_dados_owner' e armazenar em um mesmo objeto
function registrarAlteracaoCatDadosOwner(campoBanco, valor) {
  const clausulaSet = `${campoBanco} = '${valor}'`;
  clausulasSetCatDadosOwner.push(clausulaSet);
}

// Função para registrar as alterações dos campos da tabela 'cat_dados_tabela' e armazenar em um mesmo objeto.
function registrarAlteracaoCatDadosTabela(campoBanco, valor) {
  const clausulaSet = `${campoBanco} = '${valor}'`;
  clausulasSetCatDadosTabela.push(clausulaSet);
}

// Função para registrar as alterações dos campos da tabela 'cat_dados_variaveis' e armazenar em um mesmo objeto.
function registrarAlteracaoCatDadosVariaveis(campoBanco, novoValor, idVariavel) {
  const clausulaUpdate = `UPDATE cat_dados_variaveis SET ${campoBanco} = '${novoValor}' WHERE id_variavel = ${idVariavel}`;
  updates.push(clausulaUpdate);
}


// Função chamada quando o botão continuar é pressionado.
function exibirResumoAlteracoes() {
  var resumo = "";

  // Cria um resumo das alterações realizadas.
  for (var campo in alteracoes) {
    resumo += campo + ": " + alteracoes[campo] + "<br>";
  }

  // Junta todas as cláusulas SET criada para a tabela 'cat_dados_conexoes' separando com vírgula.
  const clausulasSetStringCatDadosConexoes = clausulasSetCatDadosConexoes.join(', ');
  // Verifica se existem cláusulas para atualização na tabela 'cat_dados_conexoes'.
  if (clausulasSetStringCatDadosConexoes) {
    // Junta todas as cláusulas SET em um UPDATE e envia o update para o array 'updates'.
    const updateQueryCatDadosConexoes = `UPDATE cat_dados_conexoes SET ${clausulasSetStringCatDadosConexoes} WHERE id_tabela IN (SELECT cat_dados_tabela.id_tabela FROM cat_dados_tabela WHERE cat_dados_tabela.id_numerico = ${idTabela})`;
    updates.push(updateQueryCatDadosConexoes);
  }

  // Junta todas as cláusulas SET criada para a tabela 'cat_dados_owner' separando com vírgula.
  const clausulasSetStringCatDadosOwner = clausulasSetCatDadosOwner.join(', ');
  // Verifica se existem cláusulas para atualização na tabela 'cat_dados_owner'.
  if (clausulasSetStringCatDadosOwner) {
    // Junta todas as cláusulas SET em um UPDATE e envia o update para o array 'updates'.
    const updateQueryCatDadosOwner = `UPDATE cat_dados_owner SET ${clausulasSetStringCatDadosOwner} WHERE conjunto_de_dados IN (SELECT cat_dados_tabela.conjunto_de_dados FROM cat_dados_tabela WHERE cat_dados_tabela.id_numerico = ${idTabela})`;
    updates.push(updateQueryCatDadosOwner);
  }

  // Junta todas as cláusulas SET criada para a tabela 'cat_dados_tabela' separando com vírgula.
  const clausulasSetStringCatDadosTabela = clausulasSetCatDadosTabela.join(', ');
  // Verifica se existem cláusulas para atualização na tabela 'cat_dados_tabela'.
  if (clausulasSetStringCatDadosTabela) {
    // Junta todas as cláusulas SET em um UPDATE e envia o update para o array 'updates'.
    const updateQueryCatDadosTabela = `UPDATE cat_dados_tabela SET ${clausulasSetStringCatDadosTabela} WHERE id_numerico = ${idTabela}`;
    updates.push(updateQueryCatDadosTabela);
  }

  // Junta todos updates em um array separando-os com '; '.
  var updateQuery = updates.join('; ');

  // Armazena as variáveis no local storage.
  localStorage.setItem('updateQuery', updateQuery);
  localStorage.setItem('resumoAlteracoes', resumo);

  // Codifica os valores das variáveis idTabela e idTicket usando a função encodeURIComponent.
  const encodedIdTabela = encodeURIComponent(idTabela);

  // Monta a string de URL contendo os parâmetros id_tabela e admin com seus respectivos valores.
  href = `/ticketResumo.html?id_numerico=${encodedIdTabela}&admin=${admin}`

  // Redireciona a página atual para a URL montada.
  window.location.href = href;
}