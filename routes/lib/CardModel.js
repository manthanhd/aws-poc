var mongoose = require('mongoose');

var cardSchema = mongoose.Schema({
  accountId: Number,
  cardId: Number,
  cardNumber: String,
  cardName: String,
  currentBalance: Number,
  limit: Number
});

var CardModel = mongoose.model("Card", cardSchema);
module.exports = CardModel;