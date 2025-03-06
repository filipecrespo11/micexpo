const express = require('express');
const mongoose = require('mongoose');
const app = express();

mongoose.connect('mongodb://localhost:27017/micexpo', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB conectado'))
  .catch(err => console.log('Erro no MongoDB:', err));

const UserSchema = new mongoose.Schema({ email: String, password: String });
const ClientSchema = new mongoose.Schema({ name: String, signature: String });
const User = mongoose.model('User', UserSchema);
const Client = mongoose.model('Client', ClientSchema);

app.use(express.json());

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, password });
  if (user) res.json({ success: true, message: 'Login bem-sucedido' });
  else res.status(401).json({ success: false, message: 'Credenciais inválidas' });
});

app.post('/clientes', async (req, res) => {
  const { name, signature } = req.body;
  const client = new Client({ name, signature });
  await client.save();
  res.json({ success: true, message: 'Cliente cadastrado' });
});

app.listen(3000, () => console.log('Backend rodando na porta 3000'));