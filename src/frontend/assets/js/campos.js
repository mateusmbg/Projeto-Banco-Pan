// Obtém o parâmetro id_tabela da URL
const urlParams = new URLSearchParams(window.location.search);
const idTabela = urlParams.get('id_numerico');

// Define a url usada para a requisição
const url = `/campos?id_numerico=${idTabela}`;

// Realiza uma requisição para obter dados da tabela 
fetch(url)
  .then((response) => response.json())
  .then((data) => {
    const tabelaCorpo = document.getElementById('TabelaCorpo');
    const linhaModelo = document.getElementById('LinhaModelo');
    const linhaInfoAdicionalModelo = document.getElementById('infoAdicional');

    // Define o texto do título da tabela
    document.getElementById('tituloTabela').textContent = data[0].nome_tabela;
    document.getElementById('tituloTabelaPagina').textContent = data[0].nome_tabela;

    let indice = 1;

    // Itera sobre os dados e cria as linhas da tabela
    data.forEach((item) => {
      const novaLinha = linhaModelo.cloneNode(true);
      novaLinha.removeAttribute('id');
      novaLinha.style.display = '';

      // Preenche a primeira coluna (Índice)
      const colunaIndice = novaLinha.querySelector('#indice');
      colunaIndice.textContent = indice++;

      // Preenche a segunda coluna (Nome do Campo)
      const colunaNomeCampo = novaLinha.querySelector('#nomeCampo');
      colunaNomeCampo.textContent = item.nome_campo;

      // Preenche a terceira coluna (Amostra)
      const colunaDescricaoCampo = novaLinha.querySelector('#descricaoCampo');
      colunaDescricaoCampo.textContent = item.descricao_campo;

      // Cria uma nova linha para informações adicionais
      const novaLinhaInfoAdicional = linhaInfoAdicionalModelo.cloneNode(true);
      novaLinhaInfoAdicional.classList.remove('additional-info');
      novaLinhaInfoAdicional.style.display = 'none';

      // Preenche as informações adicionais
      const tipoCampo = novaLinhaInfoAdicional.querySelector('#tipoCampo');
      tipoCampo.textContent = `${item.tipo_campo}`;

      const tipoPessoa = novaLinhaInfoAdicional.querySelector('#tipoPessoa');
      tipoPessoa.textContent = `${item.tipo_pessoa}`;

      const amostraCampo = novaLinhaInfoAdicional.querySelector('#amostraCampo');
      amostraCampo.textContent = `${item.amostra_campo}`;

      const chavePrimaria = novaLinhaInfoAdicional.querySelector('#chavePrimaria');
      chavePrimaria.textContent = `${item.chave_primaria}`;

      const nullCampo = novaLinhaInfoAdicional.querySelector('#nullCampo');
      nullCampo.textContent = `${item.null_campo}`;

      const unq = novaLinhaInfoAdicional.querySelector('#unq');
      unq.textContent = `${item.unq}`;

      const volatil = novaLinhaInfoAdicional.querySelector('#volatil');
      volatil.textContent = `${item.volatil}`;

      const lgpd = novaLinhaInfoAdicional.querySelector('#lgpd');
      lgpd.textContent = `${item.lgpd}`;

      // Adiciona um evento de clique para exibir/ocultar informações adicionais
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
  })
  .catch((error) => {
    console.log('Erro ao obter os dados da tabela:', error);
  });