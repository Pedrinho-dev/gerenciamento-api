const express = require('express');
const { Pool } = require('pg');
const router = express.Router();

// Configuração da conexão com o PostgreSQL
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'mestre99',
  port: 5432,
});

// Rota para obter produtos
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM PRODUTOS');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao buscar produtos');
  }
});



// Rota para adicionar produtos
router.post('/', async (req, res) => {
  const { nome, preco, estoque } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO PRODUTOS (nome, preco, estoque) VALUES ($1, $2, $3) RETURNING *',
      [nome, preco, estoque]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao adicionar produto');
  }
});

// Rota para atualizar produtos
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, preco, estoque } = req.body;
  try {
    const result = await pool.query(
      'UPDATE PRODUTOS SET nome = $1, preco = $2, estoque = $3 WHERE id = $4 RETURNING *',
      [nome, preco, estoque, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).send('Produto não encontrado');
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao atualizar produto');
  }
});

// Rota para deletar produtos
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM PRODUTOS WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).send('Produto não encontrado');
    }
    res.send('Produto deletado com sucesso');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao deletar produto');
  }
});

module.exports = router;