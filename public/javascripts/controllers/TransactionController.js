var transaction = angular.module('Transactions', ['ngResource']);
transaction.controller('TransactionController', function($scope, $resource){
  
  var Transactions = $resource('http://localhost:3000/db/transactions/list/' + $scope.card.cardId);
  Transactions.get({}, function(transactions) {
    console.log($scope.card.cardId);
    console.log(transactions.transactions.length);
    
    $scope.transactions = transactions.transactions;
  });
});