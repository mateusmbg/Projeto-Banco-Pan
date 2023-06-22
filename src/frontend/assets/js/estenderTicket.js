// seleciona o botão ver ticket e o ícone correspondentes
const estenderTicket = document.querySelector('.verTicket');
const iconeTicket = document.getElementById("iconeVerTicket");

// adiciona um evento de clique no botão ver ticket
estenderTicket.addEventListener('click', () => {
    // seleciona o elemento de contúdo do ticket
    const conteudoTicket = document.querySelector('#conteudoTicket');
    
    // verifica se o conteúdo do ticket está oculto
    if(conteudoTicket.style.display === 'none') {
        // se estiver oculto, exibe o conteúdo do ticket
        conteudoTicket.style.display = 'block';
        // altera o ícone no botão ao executar uma ação
        iconeTicket.classList.remove('fa-circle-arrow-down');
        iconeTicket.classList.add('fa-circle-arrow-up');

    } else {

        // se não estiver oculto, oculta o conteúdo do ticket 
        conteudoTicket.style.display = 'none';
        // altera o ícone do botão ao executar a ação de desestender o ticket
        iconeTicket.classList.remove('fa-circle-arrow-up')
        iconeTicket.classList.add('fa-circle-arrow-down')
    } 
})