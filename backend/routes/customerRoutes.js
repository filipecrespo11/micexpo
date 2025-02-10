const express = require('express');
const Customer = require('../models/Customer');
const { protect } = require('../middleware/authMiddleware');
const moment = require('moment');

const router = express.Router();

// Função para formatar as datas
const formatCustomerDates = (customer) => {
  return {
    ...customer.toObject(),
    purchaseDate: moment(customer.purchaseDate).format('YYYY-MM-DD'),
    returnDate: moment(customer.returnDate).format('YYYY-MM-DD'),
    purchaseHistory: customer.purchaseHistory.map((history) => ({
      ...history,
      purchaseDate: moment(history.purchaseDate).format('YYYY-MM-DD'),
      returnDate: moment(history.returnDate).format('YYYY-MM-DD'),
    })),
  };
};

// Criar Cliente
router.post('/', protect, async (req, res) => {
  try {
    const customer = new Customer(req.body); // Cria o cliente com os dados enviados no corpo da requisição
    await customer.save(); // Salva o cliente no banco
    res.status(201).json(formatCustomerDates(customer)); // Retorna o cliente criado com datas formatadas
  } catch (error) {
    console.error("Erro ao criar cliente:", error.message); // Log do erro
    res.status(400).json({ message: error.message }); // Erro de validação
  }
});

// Obter Todos os Clientes
router.get('/', protect, async (req, res) => {
  try {
    const customers = await Customer.find({});
    const customersWithFormattedDates = customers.map(formatCustomerDates);
    res.json(customersWithFormattedDates); // Retorna a lista de clientes com datas formatadas
  } catch (error) {
    console.error("Erro ao buscar clientes:", error.message); // Log do erro
    res.status(500).json({ message: error.message }); // Erro de servidor
  }
});

// Obter Cliente por ID
router.get('/:id', protect, async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: "Cliente não encontrado" });
    }
    res.json(formatCustomerDates(customer)); // Retorna o cliente com datas formatadas
  } catch (error) {
    console.error("Erro ao buscar cliente:", error.message); // Log do erro
    res.status(500).json({ message: error.message }); // Erro de servidor
  }
});

// Atualizar Cliente
router.put('/:id', protect, async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: "Cliente não encontrado" });
    }

    // Adicionar a data de compra e devolução antiga ao histórico
    customer.purchaseHistory.push({
      purchaseDate: customer.purchaseDate,
      returnDate: customer.returnDate,
      observation: customer.observation,
      signature: customer.signature,
    });

    // Atualizar os campos do cliente
    customer.name = req.body.name || customer.name;
    customer.email = req.body.email || customer.email;
    customer.phone = req.body.phone || customer.phone;
    customer.cpf = req.body.cpf || customer.cpf;
    customer.purchaseDate = req.body.purchaseDate || customer.purchaseDate;
    customer.returnDate = req.body.returnDate || customer.returnDate;
    customer.observation = req.body.observation || customer.observation;
    customer.signature = req.body.signature || customer.signature;

    await customer.save(); // Salva o cliente atualizado no banco
    res.json(formatCustomerDates(customer)); // Retorna o cliente atualizado com datas formatadas
  } catch (error) {
    console.error("Erro ao atualizar cliente:", error.message); // Log do erro
    res.status(400).json({ message: error.message }); // Erro de validação
  }
});

module.exports = router;