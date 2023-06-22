// Define a URL para busca de tickets pendentes
const url = `/ticket/pendente`;

// Realiza uma requisição para a URL definida
fetch(url)
    .then((response) => response.json()) 
    .then((data) => {
        // Obtem a referência do elemento com o id 'ticketModelo'
        const ticketModelo = document.getElementById('ticketModelo');

        // Itera sobre cada item retornado na requisição
        data.forEach((item) => {
            // Clona o elemento modelo para criar um novo ticket
            const novoTicket = ticketModelo.cloneNode(true);
            // Remove o atributo 'id' do novo ticket
            novoTicket.removeAttribute('id'); 
             // Define a propriedade de display do novo ticket
            novoTicket.style.display = '';

            // Define o conteúdo dos elementos do novo ticket com os valores do item atual
            const tituloTabela = novoTicket.querySelector('#tituloTabela');
            tituloTabela.textContent = item.nome_tabela;

            const nomeSolicitante = novoTicket.querySelector('#nomeSolicitante');
            nomeSolicitante.textContent = item.nome;

            const motivoSolicitacao = novoTicket.querySelector('#motivoSolicitacao');
            motivoSolicitacao.textContent = item.motivo;

            const emailSolicitante = novoTicket.querySelector('#emailSolicitante');
            emailSolicitante.textContent = item.email;

            const resumoTicket = novoTicket.querySelector('#resumoTicket');
            resumoTicket.innerHTML = item.resumo;

            const updateTicket = novoTicket.querySelector('#updateTicket');
            updateTicket.textContent = item.update_query;

            // Define a funcionalidade do botão para visualizar o ticket
            const botaoVerTicket = novoTicket.querySelector('.verTicket');
            const iconeTicket = botaoVerTicket.querySelector('.iconeVerTicket');
            const conteudoTicketContainer = novoTicket.querySelector('.conteudoTicket');

            conteudoTicketContainer.style.display = 'none';  // Oculta o conteúdo do ticket inicialmente

            botaoVerTicket.addEventListener('click', () => {
                // Alterna a visibilidade do conteúdo do ticket e o ícone do botão ao clicar
                if (conteudoTicketContainer.style.display === 'none') {
                    conteudoTicketContainer.style.display = '';
                    iconeTicket.classList.remove('fa-circle-arrow-down');
                    iconeTicket.classList.add('fa-circle-arrow-up');
                } else {
                    conteudoTicketContainer.style.display = 'none';
                    iconeTicket.classList.remove('fa-circle-arrow-up');
                    iconeTicket.classList.add('fa-circle-arrow-down');
                }
            });

            // Define a funcionalidade do botão para apagar o ticket
            const botaoApagarTicket = novoTicket.querySelector('.escolhaRejeitar');

            botaoApagarTicket.addEventListener('click', () => {
                // Envia uma requisição para apagar o ticket
                fetch('/ticket/apagar', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ id_ticket: item.id_ticket })
                })
                    .catch(error => {
                        // Trata erros de requisição
                        console.error('Erro:', error);
                    });
                // Recarrega a página
                location.reload()  
            })

            // Define a funcionalidade do botão para aprovar o ticket
            const botaoAprovarTicket = novoTicket.querySelector('.escolhaAprovar');

            botaoAprovarTicket.addEventListener('click', () => {
                // Envia uma requisição para aprovar o ticket
                fetch('/ticket/aprovar', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        id_ticket: item.id_ticket,
                        update_query: item.update_query
                    })
                })
                    .catch(error => {
                        // Trata erros de requisição
                        console.error('Erro:', error);
                    });
                // Recarrega a página
                location.reload()  
            })

            // Adiciona o novo ticket ao elemento 'ticketsSolicitados'
            ticketsSolicitados.appendChild(novoTicket);
        });
    })
    .catch((error) => {
        // Trata qualquer erro que ocorra durante a requisição
        console.error('Ocorreu um erro na requisição:', error);
    });