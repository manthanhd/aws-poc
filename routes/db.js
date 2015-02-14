var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/MiniOASDB');

var AccountModel = require('./lib/AccountModel');
var CardModel = require('./lib/CardModel');
var TransactionModel = require('./lib/TransactionModel');

var express = require('express');
var router = express.Router();
var firstNames = ["Joe", "Jim", "Steve", "Dave", "Carl"];
var lastNames = ["Swanson", "Simpson", "Holmes", "Williams", "Peterson"];
var cardNames = ["Classic Credit Card", "Vauxhall Card", "Aspire Elite Card", "Classic Extra Card", "Aspire Business Card"];
var savedAccounts = [];
var output = "";
var cardId = 1;
var transactionId = 1;
var merchants = ["Amazon", "H&M", "ASDA", "House of fraser", "Moss Bros", "Top man", "Charles Tyrwhitt", "M&S", "Sainsburys", "Tesco", "Google Play"];

router.get('/generateRandomData', function(req, res) {
  var max_accounts = 10;
  for(var i = 1; i <= firstNames.length; i++){
    var firstName = firstNames[i];
    for(var j = 1; j <= lastNames.length; j++){
      var lastName = lastNames[i];
      var account = new AccountModel();
      account.accountId = i + j + 1000000000;
      account.primaryCustomer = {
        firstName: firstName,
        lastName: lastName,
        username: firstName + lastName,
        password: 'password'
      };
      account.save();
      savedAccounts.push(account.accountId);
      output += "Account created with accountId: " + account.accountId + "<br/>"

      var max_cards = Math.floor(Math.random() * (cardNames.length/2));
      output += "This account will have " + max_cards + " cards.<br/>";
      for(var k = 0; k < max_cards; k++){
        var card = new CardModel();
        card.accountId = account.accountId;
        card.cardId = cardId++;
        card.cardNumber = 1000000000000000 + k;
        card.cardName = cardNames[k];
        card.limit = Math.floor(Math.random() * 40) * 100;  // Random card limit from 100 to 4000;
        card.currentBalance = card.limit;
        
        var max_transactions = Math.floor(Math.random() * 50);  // Random transactions from 0 to 50 per card.
        for(var l = 0; l < max_transactions; l++){
          var transaction = new TransactionModel();
          transaction.cardId = card.cardId;
          transaction.transactionId = transactionId++;
          transaction.transactionDate = new Date();
          var randomMerchantIndex = Math.floor(Math.random() * merchants.length);
          transaction.description =  merchants[randomMerchantIndex];
          var coinflip = Math.floor(Math.random() * 10);
          transaction.type = (coinflip <= 5) ? "DEBIT" : "CREDIT";
          transaction.value = Math.floor(Math.random() * 200);
          if(transaction.type == "DEBIT"){
            card.currentBalance -= transaction.value;
          } else {
            card.currentBalance += transaction.value;
          }
          transaction.save();
        }
        // Doing it later as above loop might change the balance
        card.save();
        output += k + ". Card with cardId: " + card.cardId + " created.<br/>";
      }
      output += "<br/><br/>"
    }
  }
  res.send(output);
});

router.get('/clearDB', function(req, res){
  mongoose.connection.db.dropDatabase();
  res.send({status: 'OK'});
});

router.post('/transactions/create', function(req, res){
  console.log("Transaction Object Received: ");
  console.log(req.body);
  var transaction = new TransactionModel();
  transaction.cardId = req.body.cardId;
  transaction.transactionId = req.body.transactionId;
  transaction.transactionDate = req.body.transactionDate;
  transaction.description = req.body.description;
  transaction.type = req.body.type;
  transaction.value = req.body.value;
  transaction.save();
  CardModel.findOne({cardId: req.body.cardId}, function(err, card){
    if(err){
      transaction.remove();
      res.send({status:'ERROR'});
    } else {
      console.log(card);
      if(transaction.type == "DEBIT") {
        card.currentBalance -= transaction.value;
      } else {
        card.currentBalance += transaction.value;
      }
      console.log(card);
      card.save();
      res.send(transaction);
    }
  });
  
});

router.get('/transactions/list/:cardId', function(req, res){
  var cardId = req.params.cardId;
  TransactionModel.find({cardId: cardId}, function(err, result){
    if(err){
      res.send({status:'ERROR'});
    } else {
      res.send({transactions: result});
    }
  })
});

router.get('/cards/list/:accountId', function(req, res){
  var accountId = req.params.accountId;
  CardModel.find({accountId: accountId}, function(err, cards) {
    if(err){
      res.send({status:'ERROR'});
    } else {
      res.send({cards: cards});
    }
  });
});

router.get('/accounts/list', function(req, res){
  AccountModel.find({}, function(err, accounts) {
    if(err){
      res.send({status:'ERROR'});
    } else {
      res.send({accounts: accounts});
    }
  });
});

router.get('/allthedata', function(req, res){
  AccountModel.find({}, function(err, accounts) {
    if(err){
      res.send({status:'ERROR'});
    } else {
      for(var accountIndex = 0; accountIndex < accounts.length; accountIndex++) {
        CardModel.find({accountId: accounts[accountIndex].accountId}, function(err, cards) {
          if(err){
            console.log({status:'ERROR'});
          }
          
          for(var cardIndex = 0; cardIndex < cards.length; cardIndex++){
            TransactionModel.find({cardId: cards[cardIndex].cardId}, function(err, transactions) {
              if(err){
                res.send({status:'ERROR'});
              }
              cards.transactions = transactions;
            });
          }
          
          accounts[accountIndex].cards = cards;
           
        });
      };
      res.send(accounts);
    }
  });
});

module.exports = router;