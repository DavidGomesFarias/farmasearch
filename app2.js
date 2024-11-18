const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/')));

const db = mysql.createConnection({
  host: '195.201.241.251',
  user: 'fariasdi_david',
  password: 'Davidgomes@123',
  database: 'fariasdi_davidDB'
});

db.connect(err => {
  if (err) throw err;
  console.log('Conectado ao MySQL');
});

// // Fixo
// app.get('/dados', (req, res) => {
//   console.log('Requisição recebida para /dados');
//   db.query('SELECT * FROM anapolis', (err, results) => {
//     if (err) {
//       console.error('Erro na consulta:', err);
//       return res.status(500).json({ error: 'Erro no servidor' });
//     }
//     res.json(results);
//   });
// });



 // Funções CRUD

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/', 'index.html'));
});

app.get('/dados/:cidade', (req, res) => {
  const cidade = req.params.cidade;

  db.query(`SELECT * FROM ${cidade}`, (err, results) => {
    if (err) {
      console.error('Erro na consulta:', err);
      return res.status(500).json({ error: 'Erro no servidor' });
    }

    // Formatação das datas antes de enviar ao front-end
    const formattedResults = results.map(item => {
      if (item.data_pedido) {
        item.data_pedido = new Date(item.data_pedido).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
      }
      if (item.data_previsao) {
        item.data_previsao = new Date(item.data_previsao).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
      }
      return item;
    });

    res.json(formattedResults);
  });
});

// Código teste
app.post('/dados', (req, res) => {
  const { cidade, nome_remedio, disponibilidade, data_pedido, data_previsao } = req.body;

  if (!cidade || !nome_remedio || !disponibilidade) {
    return res.status(400).json({ message: 'Dados insuficientes' });
  }
  
  let query = '';
  if (disponibilidade === 'Disponível') {
    query = `INSERT INTO ${cidade}(nome_remedio, disponibilidade) VALUES (?, ?)`;
    db.query(query, [nome_remedio, disponibilidade], (err, result) => {
      if (err) {
        console.error('Erro ao inserir dados:', err);
        return res.status(500).json({message: 'Erro no servidor'})
      }
        res.status(201).json({message: 'Dados inseridos com sucesso!'})
    });
  } else {
    query = `INSERT INTO ${cidade}(nome_remedio, disponibilidade, data_pedido, data_previsao) VALUES (?, ?, ?, ?)`;
    db.query(query, [nome_remedio, disponibilidade, data_pedido, data_previsao], (err, result) => {
      if (err) {
        console.error('Erro ao inserir dados Indisponíveis', err)
        return res.status(500).json({message: 'Erro no servidor'})
      }
      res.status(201).json({message: 'Dados inseridos com Sucesso!'})
    });
  }
});

app.put('/dados/:id', (req, res) => {
  const { cidade, id, novo_nome_remedio, nova_disponibilidade, nova_data_pedido, nova_data_previsao } = req.body;

  if (!id || !novo_nome_remedio || !nova_disponibilidade) {
    return res.status(400).json({ message: 'Dados insuficientes' });
  }
  
  let query = '';
  if (nova_disponibilidade === 'Disponível') {
    query = `UPDATE ${cidade} SET nome_remedio = ?, disponibilidade = ?, data_pedido = NULL, data_previsao = NULL WHERE id = ${id}`;
    db.query(query, [novo_nome_remedio, nova_disponibilidade], (err, result) => {
      if (err) {
        console.error('Erro ao inserir dados:', err);
        return res.status(500).json({message: 'Erro no servidor'})
      }
        res.status(201).json({message: 'Dados inseridos com sucesso!'})
    });
  } else {
    query = `UPDATE ${cidade} SET nome_remedio = ?, disponibilidade = ?, data_pedido = ?, data_previsao = ? WHERE id = ${id}`;
    db.query(query, [novo_nome_remedio, nova_disponibilidade, nova_data_pedido, nova_data_previsao], (err, result) => {
      if (err) {
        console.error('Erro ao inserir dados Indisponíveis', err)
        return res.status(500).json({message: 'Erro no servidor'})
      }
      res.status(201).json({message: 'Dados inseridos com Sucesso!'})
    });
  }
});

app.delete('/dados/:cidade/:id', (req, res) => {
  const { cidade, id } = req.params;

  // Validação básica para garantir que os parâmetros foram passados
  if (!cidade || !id) {
    return res.status(400).json({ error: 'Cidade e ID são obrigatórios.' });
  }

  const query = `DELETE FROM ?? WHERE id = ?`; // Uso de placeholders para maior segurança
  const values = [cidade, id];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Erro ao deletar o item:', err); // Log do erro para depuração
      return res.status(500).json({ error: 'Erro ao deletar o item no banco de dados.' });
    }

    res.json({ message: 'Item deletado com sucesso.' });
  });
});



app.listen(80, () => {
  console.log('Servidor rodando na porta 3001');
});
