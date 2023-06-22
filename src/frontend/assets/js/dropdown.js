document.addEventListener('DOMContentLoaded', function () {
  // Obtém o elemento dropdown com o ID 'grupo'
  var dropdown = document.getElementById('grupo');
  // Obtém todos os elementos com a classe 'content'
  var grupos = document.getElementsByClassName('content');

  // Função para exibir apenas os elementos da classe 'content' que correspondem ao valor selecionado no dropdown
  function mostrarDivs() {
    // Obtém o valor atual selecionado no dropdown
    var grupoSelecionado = dropdown.value;

    // Itera sobre todos os elementos com a classe 'content'
    for (var i = 0; i < grupos.length; i++) {
      // Se o id do elemento atual corresponder ao valor selecionado no dropdown, o elemento é exibido
      if (grupos[i].id === grupoSelecionado) {
        grupos[i].style.display = 'block';
      // Se não corresponder, o elemento é ocultado
      } else {
        grupos[i].style.display = 'none';
      }
    }
  }

  // Chama a função para exibir os elementos iniciais baseados no valor atualmente selecionado no dropdown
  mostrarDivs();

  // Adiciona um ouvinte de evento ao dropdown para chamar a função 'mostrarDivs' sempre que o valor selecionado mudar
  dropdown.addEventListener('change', mostrarDivs);
});