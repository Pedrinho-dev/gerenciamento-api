const express = require('express');
const cors = require('cors');
const app = express();
const port = 3001;

app.use(express.json());


app.use(cors()); 

// Importa arquivos
const clientesRouter = require('./clientes/clientes');
const produtosRouter = require('./produtos/produtos');

// Rotas
app.use('/clientes', clientesRouter);
app.use('/produtos', produtosRouter);

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});