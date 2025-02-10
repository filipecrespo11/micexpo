require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const customerRoutes = require('./routes/customerRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Conexão ao Banco de Dados
connectDB();

// Rotas
app.use('/customers', customerRoutes); // Rota de clientes
app.use('/auth', authRoutes); // Rota de autenticação

// Porta do Servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
