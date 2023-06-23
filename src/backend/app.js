// Importação de módulos necessários
const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const urlencodedParser = bodyParser.urlencoded({ extended: false })

// Caminho do banco de dados SQLite a ser utilizado
const DBPATH = 'backend/data/catalogo_dados.db';

// Definição do hostname e porta do servidor web
const hostname = '127.0.0.1';
const port = 5500;

// Criação de uma instância do objeto "app" do Express
const app = express();

// Configuração do servidor para servir arquivos estáticos do diretório "frontend"
app.use(express.static('frontend/'));

// Configuração do servidor para lidar com requisições JSON
app.use(express.json());


// Configuração do servidor para lidar com requisições codificadas em texto simples
app.use(bodyParser.text({ type: 'text/plain' }));

// Configuração do servidor para lidar com requisições codificadas em URL
app.use(bodyParser.urlencoded({ extended: false }));

// Endpoint "/pesquisa" que utiliza o método GET para realizar a pesquisa nas tabelas de acordo com os termos digitados
app.get('/pesquisa', (req, res) => {
    // Configuração do código de status HTTP para 200 (Ok)
    res.statusCode = 200;
    // Configuração dos headers para permitir requisições de qualquer origem
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Define a quantidade de registros que serão retornados por página
    const registrosPorPagina = 10;
    // Extrai o número da página dos parâmetros da requisição, se não for fornecido, define como 1
    let pagina = parseInt(req.query.pagina);
    // Calcula a quantidade de registros a serem pulados na consulta SQL
    const offset = (pagina - 1) * registrosPorPagina;

    // Extrai os termos de pesquisa da requisição e os divide em um array de termos
    const termosPesquisa = req.query.term.trim().split(" ");

    // Extrai os parâmetros de filtro da requisição
    const conjuntoDeDadosFiltro = req.query.conjuntoDeDados;
    const dadosSensiveisFiltro = req.query.dadosSensiveis;
    const ownerFiltro = req.query.owner;
    const stewardFiltro = req.query.steward;

    // Cria um array de termos para a cláusula SQL "LIKE"
    const termosLike = termosPesquisa.map((termo) => `%${termo}%`);

    // Cria uma string com os termos de pesquisa para a cláusula "WHERE" da consulta SQL
    const termosParams = termosPesquisa
        .map(() => '(LOWER(cat_dados_tabela.nome_tabela) LIKE ? OR LOWER(cat_dados_tabela.conjunto_de_dados) LIKE ? OR LOWER(cat_dados_tabela.conteudo_tabela) LIKE ? OR LOWER(cat_dados_owner.nome_data_owner) LIKE ?)')
        .join(' OR ');

    // Construção inicial da consulta SQL
    let sql = `SELECT 
    cat_dados_tabela.*, cat_dados_owner.*, cat_dados_conexoes.*
FROM 
    cat_dados_tabela
    INNER JOIN cat_dados_owner ON cat_dados_tabela.conjunto_de_dados = cat_dados_owner.conjunto_de_dados
    INNER JOIN cat_dados_conexoes ON cat_dados_tabela.id_tabela = cat_dados_conexoes.id_tabela
    INNER JOIN feedback ON cat_dados_tabela.id_numerico = feedback.id_numerico`;

    // Array de parâmetros para a consulta SQL
    const params = [...termosLike, ...termosLike, ...termosLike, ...termosLike];

    // Adiciona a cláusula WHERE à consulta SQL
    sql += ' WHERE ' + termosParams;

    // Adiciona condições de filtro à consulta SQL, se aplicável
    if (conjuntoDeDadosFiltro && typeof conjuntoDeDadosFiltro === 'string') {
        sql += ' AND cat_dados_tabela.conjunto_de_dados = ?';
        params.push(conjuntoDeDadosFiltro);
    }

    // Semelhante ao acima, mas para dados sensíveis
    if (dadosSensiveisFiltro && typeof dadosSensiveisFiltro === 'string') {
        sql += ' AND cat_dados_tabela.dados_sensiveis_tabela = ?';
        params.push(dadosSensiveisFiltro);
    }

    // Semelhante ao acima, mas para o proprietário dos dados
    if (ownerFiltro && typeof ownerFiltro === 'string') {
        sql += ' AND cat_dados_owner.nome_data_owner = ?';
        params.push(ownerFiltro);
    }

    // Semelhante ao acima, mas para o steward dos dados
    if (stewardFiltro && typeof stewardFiltro === 'string') {
        sql += ' AND cat_dados_owner.nome_data_steward = ?';
        params.push(stewardFiltro);
    }

    // Adiciona a ordenação à consulta SQL
    sql += `ORDER BY 
        CASE WHEN feedback.classificacao_admin IS NULL OR feedback.classificacao_admin = 0 THEN 1 ELSE 0 END,
        feedback.classificacao_admin DESC,
        feedback.qtd_like_colaborador DESC`;

    // Adiciona limitação e offset à consulta SQL para implementar a paginação
    sql += ' LIMIT ? OFFSET ?';
    params.push(registrosPorPagina);
    params.push(offset);

    // Cria uma nova conexão com o banco de dados
    var db = new sqlite3.Database(DBPATH);
    // Executa a consulta SQL e retorna os resultados
    db.all(sql, params, (err, rows) => {
        // Caso haja erro, loga o erro e retorna uma mensagem de erro
        if (err) {
            console.error(err);
            return res.status(500).send('Erro interno do servidor.');
        }
        // Se não houver erro, retorna os resultados da consulta como resposta JSON
        res.json(rows);
    });
});

// Endpoint '/resultado' que utiliza o método GET para puxar as informações da tabela solicitada
app.get('/resultado', (req, res) => {
    // Configuração do código de status HTTP para 200 (Ok)
    res.statusCode = 200;
    // Configuração dos headers para permitir requisições de qualquer origem
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Extrai o id numérico dos parâmetros da requisição
    const idNumerico = req.query.id_numerico;

    // Construção da consulta SQL
    const sql = `SELECT * FROM cat_dados_tabela JOIN cat_dados_owner ON cat_dados_tabela.conjunto_de_dados = cat_dados_owner.conjunto_de_dados JOIN cat_dados_conexoes ON cat_dados_tabela.id_tabela = cat_dados_conexoes.id_tabela WHERE cat_dados_tabela.id_numerico = ${idNumerico}`;

    // Cria uma nova conexão com o banco de dados
    var db = new sqlite3.Database(DBPATH);
    // Executa a consulta SQL e retorna os resultados
    db.all(sql, [], (err, rows) => {
        // Caso haja erro, lança o erro
        if (err) {
            throw err;
        }
        // Se não houver erro, retorna os resultados da consulta como resposta JSON
        res.json(rows);

        // Fecha a conexão com o banco de dados
        db.close();
    });
});


// Endpoint '/campos' que utiliza o método GET para puxar as informações dos campos da tabela solicitada
app.get('/campos', (req, res) => {
    // Configuração do código de status HTTP para 200 (Ok)
    res.statusCode = 200;
    // Configuração dos headers para permitir requisições de qualquer origem
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Construção da consulta SQL para obter os campos
    sql = "SELECT * FROM cat_dados_variaveis JOIN cat_dados_tabela ON cat_dados_variaveis.id_tabela = cat_dados_tabela.id_tabela WHERE id_numerico=" + req.query.id_numerico;

    // Cria uma nova conexão com o banco de dados
    var db = new sqlite3.Database(DBPATH);
    // Executa a consulta SQL e retorna os resultados
    db.all(sql, [], (err, rows) => {
        // Caso haja erro, lança o erro
        if (err) {
            throw err;
        }
        // Se não houver erro, retorna os resultados da consulta como resposta JSON
        res.json(rows);
    });
    // Fecha a conexão com o banco de dados
    db.close();
});

// Endpoint '/tabela/nome' que utiliza o método GET para puxar o nome da tabela solicitada
app.get('/tabela/nome', (req, res) => {
    res.statusCode = 200;
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Construção da consulta SQL para obter o nome da tabela
    var sql = "SELECT nome_tabela FROM cat_dados_tabela WHERE id_numerico=" + req.query.id_numerico;
    // Cria uma nova conexão com o banco de dados
    var db = new sqlite3.Database(DBPATH); // Abre o banco
    // Executa a consulta SQL e retorna os resultados
    db.all(sql, [], (err, rows) => {
        // Caso haja erro, lança o erro
        if (err) {
            throw err;
        }
        // Se não houver erro, retorna os resultados da consulta como resposta JSON
        res.json(rows);
    });
    // Fecha a conexão com o banco de dados
    db.close();
});

// Endpoint '/ticket/solicitacao' que utiliza o método POST para criar um ticket de solicitação de alteração de dados
app.post('/ticket/solicitacao', (req, res) => {
    res.statusCode = 200;
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Separa as linhas do corpo da requisição
    const lines = req.body.split('\n');

    // Mapeia os valores a partir das linhas
    const values = lines.reduce((acc, line) => {
        const [key, value] = line.split('|');
        acc[key.trim()] = value.trim();
        return acc;
    }, {});

    // Extrai os valores individuais
    const { nome, email, motivo, id_numerico, update_query, status, resumo } = values;

    // Executa a lógica de atualização no banco de dados
    const sql = `INSERT INTO ticket (nome, email, motivo, id_numerico, update_query, status, resumo) VALUES ('${nome}', '${email}', '${motivo}', '${id_numerico}', '${update_query.replace(/'/g, "''")}', '${status}', '${resumo}')`;

    // Cria uma nova conexão com o banco de dados
    var db = new sqlite3.Database(DBPATH); // Abre o banco
    // Executa a consulta SQL e retorna os resultados
    db.all(sql, [], (err, rows) => {
        // Caso haja erro, lança o erro
        if (err) {
            throw err;
        }

        res.send('Ticket enviado com sucesso');

        // Fecha o banco
        db.close();
    });
});

// Endpoint '/ticket/pendente' que utiliza o método GET para puxar as informações dos tickets com status pendente
app.get('/ticket/pendente', (req, res) => {
    // Configuração do código de status HTTP para 200 (Ok)
    res.statusCode = 200;
    // Configuração dos headers para permitir requisições de qualquer origem
    res.setHeader('Access-Control-Allow-Origin', '*');
    sql = "SELECT * FROM ticket JOIN cat_dados_tabela ON ticket.id_numerico = cat_dados_tabela.id_numerico WHERE status = 'pendente'";
    // Cria uma nova conexão com o banco de dados
    var db = new sqlite3.Database(DBPATH); // Abre o banco
    // Executa a consulta SQL e retorna os resultados
    db.all(sql, [], (err, rows) => {
        // Caso haja erro, lança o erro
        if (err) {
            throw err;
        }
        // Se não houver erro, retorna os resultados da consulta como resposta JSON
        res.json(rows);
    });
    // Fecha a conexão com o banco de dados
    db.close();
});

// Endpoint '/ticket/apagar' que utiliza o método PUT para atualizar o status do ticket para rejeitado
app.put('/ticket/apagar', urlencodedParser, (req, res) => {
    // Configuração do código de status HTTP para 200 (Ok)
    res.statusCode = 200;
    // Configuração dos headers para permitir requisições de qualquer origem
    res.setHeader('Access-Control-Allow-Origin', '*');
    sql = "UPDATE ticket SET status='rejeitado' WHERE id_ticket=" + req.body.id_ticket;
    console.log(sql)
    // Cria uma nova conexão com o banco de dados
    var db = new sqlite3.Database(DBPATH); // Abre o banco
    // Executa a consulta SQL e retorna os resultados
    db.all(sql, [], (err, rows) => {
        // Caso haja erro, lança o erro
        if (err) {
            throw err;
        }
        // Se não houver erro, retorna os resultados da consulta como resposta JSON
        res.json(rows);
    });
    // Fecha a conexão com o banco de dados
    db.close();
});

// Endpoint '/ticket/aprovar' que utiliza o método PUT para atualizar o status do ticket para aprovado
app.put('/ticket/aprovar', urlencodedParser, (req, res) => {
    // Configuração do código de status HTTP para 200 (Ok)
    res.statusCode = 200;
    // Configuração dos headers para permitir requisições de qualquer origem
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Definição da consulta SQL para atualizar o status do ticket para 'aprovado'
    var consultaSQL = "UPDATE ticket SET status='aprovado' WHERE id_ticket=" + req.body.id_ticket;
    // Armazena a consulta de atualização enviada na requisição
    var consultaUpdate = req.body.update_query;

    // Cria uma nova conexão com o banco de dados
    var db = new sqlite3.Database(DBPATH);

    // Executa a consulta SQL para atualizar o status do ticket
    db.run(consultaSQL, [], erroConsulta => {
        // Em caso de erro na execução da consulta, registra o erro, retorna uma mensagem de erro e fecha a conexão com o banco
        if (erroConsulta) {
            console.error('Erro ao executar a consulta:', erroConsulta);
            res.status(500).json({ error: 'Ocorreu um erro ao aprovar o ticket.' });
            db.close();
            return;
        }

        // Se uma consulta de atualização foi fornecida na requisição
        if (consultaUpdate) {
            // Divide as queries separadas por ponto e vírgula
            var queries = consultaUpdate.split(';');
            // Remove espaços em branco extras
            queries = queries.map(query => query.trim());

            // Armazena a quantidade total de queries para serem executadas
            var totalQueries = queries.length;
            // Contador para o número de queries já executadas
            var queriesExecutadas = 0;
            // Flag para indicar se ocorreu algum erro durante a execução das queries de atualização
            var erroUpdateOcorreu = false;

            // Loop por todas as queries de atualização
            queries.forEach(query => {
                // Se a query não está vazia
                if (query) {
                    // Executa a query
                    db.run(query, [], erroUpdate => {
                        // Incrementa o contador de queries executadas
                        queriesExecutadas++;
                        // Se houve um erro na execução da query, registra o erro e define a flag de erro como verdadeira
                        if (erroUpdate) {
                            console.error('Erro ao executar a consulta de atualização:', erroUpdate);
                            erroUpdateOcorreu = true;
                        }

                        // Se todas as queries foram executadas
                        if (queriesExecutadas === totalQueries) {
                            // Se ocorreu algum erro, retorna uma mensagem de erro
                            if (erroUpdateOcorreu) {
                                res.status(500).json({ error: 'Ocorreu um erro ao executar a consulta de atualização.' });
                            } else {
                                // Se não houve erros, retorna uma mensagem de sucesso
                                res.json({ message: 'Ticket aprovado com sucesso.' });
                            }
                            // Fecha a conexão com o banco de dados
                            db.close();
                        }
                    });
                } else {
                    // Se a query está vazia, apenas incrementa o contador de queries executadas
                    queriesExecutadas++;
                    // Se todas as queries foram executadas
                    if (queriesExecutadas === totalQueries) {
                        // Se ocorreu algum erro, retorna uma mensagem de erro
                        if (erroUpdateOcorreu) {
                            res.status(500).json({ error: 'Ocorreu um erro ao executar a consulta de atualização.' });
                        } else {
                            // Se não houve erros, retorna uma mensagem de sucesso
                            res.json({ message: 'Ticket aprovado com sucesso.' });
                        }
                        // Fecha a conexão com o banco de dados
                        db.close();
                    }
                }
            });
        } else {
            // Se não houve consulta de atualização na requisição, apenas fecha a conexão com o banco de dados
            db.close();
        }
    });
});


// Endpoint '/estrelinhas/:id' que utiliza o método GET para puxar as informações de classificação do admin para a tabela solicitada
app.get('/estrelinhas/:id', (req, res) => {
    // Configuração do código de status HTTP para 200 (Ok)
    res.statusCode = 200;
    // Configuração dos headers para permitir requisições de qualquer origem
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Pega o ID da classificação dos parâmetros da requisição
    const idClassificacao = req.params.id;
    // Cria a consulta SQL para obter a classificação do admin para o ID fornecido
    sql = `SELECT classificacao_admin FROM feedback WHERE id_numerico = ${idClassificacao}`;
    // Cria uma nova conexão com o banco de dados
    var db = new sqlite3.Database(DBPATH); // Abre o banco
    // Executa a consulta SQL e retorna os resultados
    db.all(sql, [], (err, rows) => {
        // Caso haja erro, lança o erro
        if (err) {
            throw err;
        }
        // Se não houver erro, retorna os resultados da consulta como resposta JSON
        res.json(rows);
    });
    // Fecha a conexão com o banco de dados
    db.close();
});

// Endpoint '/attClassificacao' que utiliza o método PUT para atualizar a classificação do admin para a tabela solicitada
app.put('/attClassificacao', urlencodedParser, (req, res) => {
    // Configuração do código de status HTTP para 200 (Ok)
    res.statusCode = 200;
    // Configuração dos headers para permitir requisições de qualquer origem
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Cria a consulta SQL para atualizar a classificação do admin para o ID fornecido
    sql = `UPDATE feedback SET classificacao_admin = ${req.body.classificacao_admin} WHERE id_numerico = ${req.body.id_numerico};`;
    // Cria uma nova conexão com o banco de dados
    var db = new sqlite3.Database(DBPATH);
    db.run(sql, [], err => {
        if (err) {
            throw err;
        }
    });
    db.close();
    res.end();
});

// Endpoint '/joinha/:id' que utiliza o método GET para puxar as informações de feedback do colaborador para a tabela solicitada
app.get('/joinha/:id', (req, res) => {
    // Configuração do código de status HTTP para 200 (Ok)
    res.statusCode = 200;
    // Configuração dos headers para permitir requisições de qualquer origem
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Pega o ID do feedback dos parâmetros da requisição
    const idJoinha = req.params.id;
    // Cria a consulta SQL para obter o feedback do colaborador para o ID fornecido
    sql = `SELECT qtd_like_colaborador FROM feedback WHERE id_numerico = ${idJoinha}`;
    // Cria uma nova conexão com o banco de dados
    var db = new sqlite3.Database(DBPATH);
    // Executa a consulta SQL e retorna os resultados
    db.all(sql, [], (err, rows) => {
        // Caso haja erro, lança o erro
        if (err) {
            throw err;
        }
        // Se não houver erro, retorna os resultados da consulta como resposta JSON
        res.json(rows);
    });
    // Fecha a conexão com o banco de dados
    db.close();
});

// Endpoint '/attJoinha' que utiliza o método PUT para atualizar o feedback do colaborador para a tabela solicitada
app.put('/attJoinha', urlencodedParser, (req, res) => {
    // Configuração do código de status HTTP para 200 (Ok)
    res.statusCode = 200;
    // Configuração dos headers para permitir requisições de qualquer origem
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Cria a consulta SQL para atualizar o feedback do colaborador para o ID fornecido
    sql = `UPDATE feedback SET qtd_like_colaborador = ${req.body.qtd_like_colaborador} WHERE id_numerico = ${req.body.id_numerico};`;
    // Cria uma nova conexão com o banco de dados
    var db = new sqlite3.Database(DBPATH);
    // Executa a consulta SQL e retorna os resultados
    db.all(sql, [], (err, rows) => {
        // Caso haja erro, lança o erro
        if (err) {
            throw err;
        }
        // Se não houver erro, retorna os resultados da consulta como resposta JSON
        res.json(rows);
    });
    // Fecha a conexão com o banco de dados
    db.close();
});

// Inicialização do servidor web na porta e hostname definidos anteriormente
app.listen(port, hostname, () => {
    console.log(`Servidor rodando em http://${hostname}:${port}/`);
});