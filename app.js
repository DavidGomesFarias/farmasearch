const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

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



// // Funções CRUD
// app.get('/dados', (req, res) => {
//   db.query(`SELECT * FROM goiania`, (err, results) => {
//     if (err) throw err;
//     res.json(results);
//   });
// });

// app.post('/dados', (req, res) => {
//   const newItem = { text: req.body.text };
//   db.query('INSERT INTO itens SET ?', newItem, (err, result) => {
//     if (err) throw err;
//     res.sendStatus(201);
//   });
// });

// app.put('/dados/:id', (req, res) => {
//   const { id } = req.params;
//   const { text } = req.body;
//   db.query('UPDATE itens SET text = ? WHERE id = ?', [text, id], (err, result) => {
//     if (err) throw err;
//     res.sendStatus(200);
//   });
// });

// app.delete('/dados/:id', (req, res) => {
//   const { id } = req.params;
//   db.query('DELETE FROM itens WHERE id = ?', [id], (err, result) => {
//     if (err) throw err;
//     res.sendStatus(200);
//   });
// });

app.listen(80, () => {
  console.log('Servidor rodando na porta 3000');
});
