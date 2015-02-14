var mongoose = require('mongoose');

var accountSchema = mongoose.Schema({
  accountId: Number,
  primaryCustomer: {
    firstName: String,
    lastName: String,
    username: String,
    password: String
  }
});

var AccountModel = mongoose.model("Account", accountSchema);
module.exports = AccountModel;