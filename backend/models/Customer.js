const mongoose = require('mongoose');
const CryptoJS = require('crypto-js');

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String }, // Email não é mais obrigatório
  cpf: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  purchaseDate: { type: Date, required: true },
  returnDate: { type: Date, required: true },
  password: {
    type: String,
    required: true,
    set: (password) => CryptoJS.AES.encrypt(password, 'secret key 123').toString(),
  },
  observation: { type: String, required: true },
  signature: { type: String }, // Armazena a assinatura atual em Base64
  purchaseHistory: [
    {
      observation: { type: String },
      purchaseDate: { type: Date },
      returnDate: { type: Date },
      signature: { type: String },
    },
  ], // Histórico de compras e devoluções
});

// Método para descriptografar a senha
customerSchema.methods.decryptPassword = function () {
  const bytes = CryptoJS.AES.decrypt(this.password, 'secret key 123');
  return bytes.toString(CryptoJS.enc.Utf8);
};

module.exports = mongoose.model('Customer', customerSchema);