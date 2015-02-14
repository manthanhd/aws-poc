var mongoose = require('mongoose');

var transactionSchema = mongoose.Schema({
  cardId: Number,
  transactionId: Number,
  transactionDate: Date,
  description: String,
  type: String,
  value: Number,
});

var TransactionModel = mongoose.model("Transaction", transactionSchema);
module.exports = TransactionModel;