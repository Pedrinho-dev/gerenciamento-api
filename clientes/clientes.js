const express = require('express');
const { Pool } = require('pg');
const router = express.Router();


const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'mestre99',
  port: 5432,
});

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM CLIENTES');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao buscar clientes');
  }
});

// Rota para obter o total de clientes
router.get('/total', async (req, res) => {
  try {
    const result = await pool.query('SELECT COUNT(*) FROM CLIENTES');
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao buscar total de clientes');
  }
});

// Rota para obter clientes por nome
router.get('/nome/:nome', async (req, res) => {
  const { nome } = req.params;
  try {
    const result = await pool.query('SELECT * FROM CLIENTES WHERE nome ILIKE $1', [`%${nome}%`]);
    if (result.rows.length === 0) {
      return res.status(404).send('Cliente não encontrado');
    }
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao buscar cliente');
  }
});

// Rota para adicionar clientes
router.post('/', async (req, res) => {
  const { nome, telefone, total_compras } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO CLIENTES (nome, telefone, total_compras) VALUES ($1, $2, $3) RETURNING *',
      [nome, telefone, total_compras]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao adicionar cliente');
  }
});

// Rota para atualizar clientes
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, telefone, total_compras } = req.body;
  try {
    const result = await pool.query(
      'UPDATE CLIENTES SET nome = $1, telefone = $2, total_compras = $3 WHERE id = $4 RETURNING *',
      [nome, telefone, total_compras, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).send('Cliente não encontrado');
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao atualizar cliente');
  }
});

// Rota para deletar clientes
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM CLIENTES WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).send('Cliente não encontrado');
    }
    res.send('Cliente deletado com sucesso');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao deletar cliente');
  }
});

module.exports = router;